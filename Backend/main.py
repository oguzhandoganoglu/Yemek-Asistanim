from flask import Flask, jsonify, request
from flask_cors import CORS
import openai
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
import time
from firebase import firebase
import firebase_admin
from firebase_admin import credentials, auth
#import pyrebase

config = {
    "apiKey": "AIzaSyD1dsZ590gGskokLvT40AlvpBfClaEAECk",
    "authDomain": "yemek-asistani.firebaseapp.com",
    "projectId": "yemek-asistani",
    "storageBucket": "yemek-asistani.appspot.com",
    "messagingSenderId": "335909231649",
    "appId": "1:335909231649:web:2da483d625eed3339bd760",
    "measurementId": "G-T86BVWV371",
    "databaseURL": ""
}

embedding_model = "text-embedding-3-small"
collection_name = "yemek_asistani"

#firebaseAuth = pyrebase.initialize_app(config)
#auth = firebaseAuth.auth()
firebase = firebase.FirebaseApplication('https://yemek-asistani-default-rtdb.europe-west1.firebasedatabase.app/', None)

cred = credentials.Certificate('./yemek-asistani-firebase-adminsdk-g0mzc-a20c15214f.json')
firebase_admin.initialize_app(cred)

clientOpenAi = openai.OpenAI(api_key="")
asisstantId = ""

qdrant_client = QdrantClient(
    url="", 
    api_key="",
)

app = Flask(__name__)
CORS(app)
logged_in = False
user_id = None

@app.route("/")
def anasayfa():
    result = firebase.get('/users', None)
    print(result)
    password_123456_users = []
    for user_id, user_info in result.items():
        if 'email' in user_info and user_info['email'] == 'oguzhan1455.fb@gmail.com':
            password_123456_users.append(user_info)

    # Sonuçları yazdırma
    for user in password_123456_users:
        print("Username:", user.get('username', 'N/A'))
        print("Email:", user.get('email', 'N/A'))
        print("---------------------------")
    return str(result)

# Burada kullanıcı kayıt işlemleri gerçekleştirilecek.
# Her kullanıcı'ya bir thread oluşturulacak ve id'si database'e yazılacak.
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    print(data)
    if request.method == 'POST':
        user_record = auth.create_user(email=data['email'], password=data['password'])
        firebase.post('/users',data)
        return jsonify({'success': True, 'uid': user_record.uid}), 201
    else:
        return jsonify({'success': False, 'message': "Sorry, there was an error."}), 400

# Kullanıcı login olabiliyor mu? Burada database'e sorgu atıp login işlemi gerçekleştirilecek.
# Eğer login olmuş ise "logged_in" global değişkenini true yapacak.
# idToken ile uid aynı değere sahip değiller ama her kullanıcı için uniqueler kullanırken göz önünde bulunduralım!!!!!
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    print(data)
    id_token = data['idToken']

    if id_token:
        try:
            # Verify the ID token and extract the user's Firebase UID
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token['uid']
            global user_id
            print("uid: " + uid)
            user_id = uid
            return jsonify({'success': True, 'uid': uid}), 200
        except auth.InvalidIdTokenError:
            return jsonify({'success': False, 'message': 'Invalid ID token'}), 401
        except auth.ExpiredIdTokenError:
            return jsonify({'success': False, 'message': 'Expired ID token'}), 401
        except Exception as e:
            return jsonify({'success': False, 'message': 'Authentication error'}), 500
    else:
        return jsonify({'success': False, 'message': 'No idToken provided'}), 400


# Burada kullanıcının login olup olmadığını kontrol etmek için bir istek kullanıyoruz.
@app.route('/check_login')
def check_login():
    # Bu örnekte, her zaman oturum açmış kabul ediyoruz
    return jsonify({"logged_in": True})

# Burada qdrant'ta search işlemlerini yapacak. Eğer benzer bir veri görürse
# ve bu veri kullanıcının dataseti'nde yok ise ekleyecek var ise bir şey yapmayacak.
@app.route('/qdrantSearch', methods=['GET'])
def qdrantSearch():
    
    # data =request.json
    hits= qdrant_client.search(
        collection_name=collection_name,
        query_vector=clientOpenAi.embeddings.create(
            input=["excludes meat, poultry, and seafood"],
            model=embedding_model,
        )
        .data[0]
        .embedding,
        limit=1

    )
    
    for hit in hits:
        if(hit.score>0.5):
            print(hit.payload, "score:", hit.score)
            nameOfDiet=hit.payload['text']
            description = nameOfDiet
            indexOfDiet = nameOfDiet.find("diet")
            nameOfDiet = nameOfDiet[:indexOfDiet]
            nameOfDiet = nameOfDiet + "diet"
            print(nameOfDiet)
            global user_id
            print(user_id)
            firebase.put(f'users/kPmamX4PBhez5BuETulPC4lprqu1/diets',nameOfDiet,description)
    return jsonify({'success': True}), 200
    


# Burada kullanıcı login olmuş ise eğer onun database'inden alışkanlıklarını almak için kullanacağız.
@app.route('/fireBaseDiyetPull')
def qdrant():
    mesaj= "firebase'den diyetler çekilecek."
    return mesaj

# Burada openAi'a tarif için istek atılıyor. Tabiki kullanıcının alışkanlıkları veritabanından alınacak
# ve bu verilerde isteğe eklenecek ve istek atılacaktır. 


@app.route('/openAiReq')
def openAiRequest():
    """
    thread = clientOpenAi.beta.threads.create(
        messages = [
        {
            "role": "user",
            "content": ""
        } 
        ]
    )
    """
    global user_id
    result = firebase.get(f'users/kPmamX4PBhez5BuETulPC4lprqu1',None)
    diet_names_string = ""
    print(result['diets'])
    for key, value in result['diets'].items():
        diet_names_string = diet_names_string + " , " + key
    print(diet_names_string)
    userAllergies = result['allergies']
    trueUserAllergies = [key for key, value in userAllergies.items() if value] # Burada sadece true değere sahip 
    allergies_string = ", ".join(trueUserAllergies)
    allergies_string = "allergic to " + allergies_string
    allergiDietMessage = diet_names_string + allergies_string
    print(allergiDietMessage)
    print("-------Thread------")
    if 'threadId' in result:
        print("Anahtar bulundu.")
        threadId = result['threadId']
        print(threadId)
        print("-----------------")
        # burada thread_id bilgisi database'den alınacak. Daha sonrasında aşağıdaki gibi o thread retrive edilecek.
        thread = clientOpenAi.beta.threads.retrieve(threadId)
    else:
        print("Anahtar bulunamadı.")
        thread = clientOpenAi.beta.threads.create()
        threadId = thread.id
        print(threadId)
        firebase.put(f'users/kPmamX4PBhez5BuETulPC4lprqu1/','threadId',threadId)    
    print("-------Thread------")
    print(allergiDietMessage)
    message = clientOpenAi.beta.threads.messages.create(
        thread_id=threadId,
        role="user",
        content=allergiDietMessage
    )
    run = clientOpenAi.beta.threads.runs.create(
        thread_id=threadId,
        assistant_id=asisstantId
    )
    while run.status != "completed":
        time.sleep(0.5)
        run = clientOpenAi.beta.threads.runs.retrieve(thread_id=threadId, run_id=run.id)
    responses= clientOpenAi.beta.threads.messages.list(thread_id=threadId)
    new_message = responses.data[0].content[0].text.value
    
    return new_message

    
""""
    message = "Keto Diet"
    message = clientOpenAi.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=message
    )
    run = clientOpenAi.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=asisstantId
    )
    while run.status != "completed":
        time.sleep(0.5)
        run = clientOpenAi.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run.id)
    
    messages= clientOpenAi.beta.threads.messages.list(thread_id=thread_id)
    new_message = messages.data[0].content[0].text.value
    return new_message
"""


@app.route('/submit', methods=['POST'])
def submit():
  if request.method == 'POST' and len(dict(request.form)) > 0:
    userdata = dict(request.form)
    name = userdata["name"]
    description = userdata["description"]
    new_data = {"name": name, "description": description}
    firebase.post("/users/diets", new_data)
    return "Thank you!"
  else:
    return "Sorry, there was an error."

if __name__ == "__main__":
    app.run(debug=True)
