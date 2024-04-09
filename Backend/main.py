from flask import Flask, jsonify, request, session
from flask_cors import CORS
import openai
from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
import time
from firebase import firebase
import firebase_admin
from firebase_admin import credentials, auth, db
import json
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
firebase_app = firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://yemek-asistani-default-rtdb.europe-west1.firebasedatabase.app/'
})
#firebase_admin.initialize_app(cred)

clientOpenAi = openai.OpenAI(api_key="")
asisstantId = ""
healthAsisstantId= ""

qdrant_client = QdrantClient(
    url="", 
    api_key="",
)

app = Flask(__name__)
app.secret_key = 'yemek_asistanim_secret_key'
CORS(app, supports_credentials=True)
logged_in = False
app.config.update(SESSION_COOKIE_SAMESITE="None", SESSION_COOKIE_SECURE=False)#çerezleri kontrol etmek için geçici olarak false olarak ayarlandı

@app.route("/")
def anasayfa():
    result = firebase.get('/users', None)
    print(result)
    return str(result)

# Burada kullanıcı kayıt işlemleri gerçekleştirilecek.
# Her kullanıcı'ya bir thread oluşturulacak ve id'si database'e yazılacak.
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    data['diets'] = [""]
    print(data)
    if request.method == 'POST':
        try:
            user_record = auth.create_user(email=data['email'], password=data['password'])
            firebase.put(f'/users', user_record.uid, data)
        except auth.EmailAlreadyExistsError:
            return jsonify({'success': False, 'message': 'This email already exists.'}), 401
        except Exception as e:
            return jsonify({'success': False, 'message': 'Sign-up error'}), 500
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
            session['user_id'] = uid
            print("session in login: " + str(session))
            print("uid: " + uid)
            return jsonify({'success': True, 'uid': uid}), 200
        except auth.InvalidIdTokenError as e:
            return jsonify({'success': False, 'message': 'Invalid ID token: '+ str(e)}), 401
        except auth.ExpiredIdTokenError:
            return jsonify({'success': False, 'message': 'Expired ID token'}), 401
        except Exception as e:
            return jsonify({'success': False, 'message': 'Authentication error: '+ str(e)}), 500
    else:
        return jsonify({'success': False, 'message': 'No idToken provided'}), 400
    
# Logout endpoint
@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return 'Logged out'


# check
@app.route('/check_loginsession')
def check_loginsession():
    print("Checking login session...")  # Session kontrolü başlıyor
    print("Current session keys and values:", dict(session))  # Mevcut session anahtarları ve değerleri
    if 'user_id' in session:
        print(f"User is logged in with ID: {session['user_id']}")  # Kullanıcı giriş yapmış, ID'si gösteriliyor
        return jsonify({'logged_in': True, 'user_id': session['user_id']})
    else:
        print("User is not logged in.")  # Kullanıcı giriş yapmamış
        return jsonify({'logged_in': False})
 

# Allergies sayfasından alerji seçimlerini veritabanına aktarmak için
@app.route('/update_allergies', methods=['POST'])
def update_allergies():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'User not logged in'}), 403

    try:
        allergies_data = request.json
        ref = db.reference(f'/users/{user_id}/allergies', app=firebase_app)  # Uygulama örneğini belirtmek önemli
        ref.set(allergies_data)
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500




@app.route('/check_session')
def check_session():
    print(session)
    if 'user_id' in session:
        return jsonify({'logged_in': True})
    else:
        return jsonify({'logged_in': False})

# Burada qdrant'ta search işlemlerini yapacak. Eğer benzer bir veri görürse
# ve bu veri kullanıcının dataseti'nde yok ise ekleyecek var ise bir şey yapmayacak.
@app.route('/qdrantSearch', methods=['GET'])
def qdrantSearch():
    
    reason = request.args.get('dislikeReason')
    print("reason: "+ reason)
    hits= qdrant_client.search(
        collection_name=collection_name,
        query_vector=clientOpenAi.embeddings.create(
            input=[reason],

            model=embedding_model,
        )
        .data[0]
        .embedding,
        limit=1

    )
    print("hit:", hits)
    for hit in hits:
        if(hit.score>0.4):
            print(hit.payload, "score:", hit.score)
            nameOfDiet=hit.payload['text']
            description = nameOfDiet
            indexOfDiet = nameOfDiet.find("diet")
            nameOfDiet = nameOfDiet[:indexOfDiet]
            nameOfDiet = nameOfDiet + "diet"
            print(nameOfDiet)
            firebase.put(f"users/{session['user_id']}/diets",nameOfDiet,description)
            return jsonify({'success': True}), 200
        else:
            return jsonify({"error": "cant find diet"}), 500


# Burada kullanıcı login olmuş ise eğer onun database'inden alışkanlıklarını almak için kullanacağız.
@app.route('/fireBaseDiyetPull', methods=['GET'])
def pullDiets():
    result = firebase.get(f"users/{session['user_id']}",None)
    print(result['diets'])
    diets = result['diets']
    return diets

@app.route('/pullTip', methods=['GET'])
def pullTip():
    result = firebase.get(f"users/{session['user_id']}",None)
    if 'healthTip' in result:
        return result['healthTip']
    else:
        if 'recipeHistory' in result:
            return healthAiRequest()
        else:
            return ""
    
@app.route('/getCountry', methods=['GET'])
def getCountry():
    result = firebase.get(f"users/{session['user_id']}",None)
    if 'country' in result:
        return result['country']
    else:
        return ''
    
@app.route('/saveCountry', methods=['POST'])
def saveCountry():
    country_data = request.get_json();
    try:
        result = firebase.put(f"users/{session['user_id']}/",'country',country_data['country'])
        return jsonify(result), 200
    except Exception as e:
        # Print the error if something goes wrong
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500

        
@app.route('/getUsername', methods=['GET'])
def getUsername():
    result = firebase.get(f"users/{session['user_id']}/",'username')
    return result

@app.route('/getEmail', methods=['GET'])
def getEmail():
    result = firebase.get(f"users/{session['user_id']}/",'email')
    return result
# burayı bilerek GET yaptım düzeltmeyin DELETE yazınca çalışmıyor
@app.route('/clearRecipeHistory', methods=['GET'])
def clearRecipeHistory():
    try:
        result = firebase.get(f"users/{session['user_id']}",None)
        if 'recipeHistory' in result:
            # Attempt to delete the diet from Firebase
            firebase.delete(f"users/{session['user_id']}/",'recipeHistory')
            return jsonify(result), 200
        else:
            return jsonify({"message": "There is no recipe history to delete"}), 404
    except Exception as e:
        # Print the error if something goes wrong
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500
    
# burayı bilerek GET yaptım düzeltmeyin DELETE yazınca çalışmıyor
@app.route('/dietRemove/<dietName>', methods=['GET'])
def removeTheDiet(dietName):
    try:
        # Attempt to delete the diet from Firebase
        result = firebase.delete(f"users/{session['user_id']}/diets/",dietName)
        print(result)
        return jsonify(result), 200
    except Exception as e:
        # Print the error if something goes wrong
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500


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
    result = firebase.get(f"users/{session['user_id']}",None)
    diet_names_string = "this user follows "
    print(result['diets'])
    diets = result['diets']
    if len(diets) > 1:
        diet_names = [key for key, value in diets.items() if key != "0"]
        diet_names_string = ', '.join(diet_names)
    else:
        diet_names_string = diet_names_string + " no diets "

    userAllergies = result['allergies']
    trueUserAllergies = [key for key, value in userAllergies.items() if value] # Burada sadece true değere sahip 
    allergies_string = ", ".join(trueUserAllergies)
    allergies_string = "allergic to " + allergies_string
    allergiDietMessage = diet_names_string +" and is "+ allergies_string

    if 'country' in result:
        allergiDietMessage = allergiDietMessage + ". Also mind that this user lives in " + result['country'] + " so the ingredients can be accessible."

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
        firebase.put(f"users/{session['user_id']}/",'threadId',threadId)    

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

@app.route('/postRecipeHistory/recipeToSend', methods=['POST'])
def postRecipeHistory():
    recipe_to_send = request.get_json()  # This will parse the JSON object sent with the POST request
    print(recipe_to_send)
    result = firebase.get(f"users/{session['user_id']}",None)
    if recipe_to_send is not None:
        recipeName = list(recipe_to_send.keys())[0]  # Gets the first key
        recipeIngredients = recipe_to_send[recipeName]
        if 'recipeHistory' in result:
            print("Tarif geçmişi bulundu.")
            
            print(result['recipeHistory'])
            firebase.put(f"users/{session['user_id']}/recipeHistory/",recipeName,recipeIngredients)
            return 'Success', 200
            print("-----------------")
        else:
            firebase.put(f"users/{session['user_id']}/",'recipeHistory',recipe_to_send)
            return 'Success', 200
    else:
        return 'Fail', 500

@app.route('/healthAiReq')
def healthAiRequest():
    result = firebase.get(f"users/{session['user_id']}",None)
    recipes_string = "this user made and consumed the recipes: "
    
    print("-------Recipe history------")
    if 'recipeHistory' in result:
        print("Tarif geçmişi bulundu.")
        
        print(result['recipeHistory'])
        recipes = result['recipeHistory']
        recipes_string = recipes_string + ', '.join(f'{key}: {value}' for key, value in recipes.items())
 
        print(recipes_string)
        print("-----------------")
        if 'healthThreadId' in result:
            print("Anahtar bulundu.")
            threadId = result['healthThreadId']
            print(threadId)
            print("-----------------")
            # burada thread_id bilgisi database'den alınacak. Daha sonrasında aşağıdaki gibi o thread retrive edilecek.
            thread = clientOpenAi.beta.threads.retrieve(threadId)
        else:
            print("Anahtar bulunamadı.")
            thread = clientOpenAi.beta.threads.create()
            threadId = thread.id
            print(threadId)
            firebase.put(f"users/{session['user_id']}/",'healthThreadId',threadId)    

        print("-------Thread------")

        message = clientOpenAi.beta.threads.messages.create(
            thread_id=threadId,
            role="user",
            content=recipes_string
        )
        run = clientOpenAi.beta.threads.runs.create(
            thread_id=threadId,
            assistant_id=healthAsisstantId
        )
        while run.status != "completed":
            time.sleep(0.5)
            run = clientOpenAi.beta.threads.runs.retrieve(thread_id=threadId, run_id=run.id)
        responses= clientOpenAi.beta.threads.messages.list(thread_id=threadId)
        new_message = responses.data[0].content[0].text.value
        print("-------Recipe History------")
        
        new_message = json.loads(new_message)
        firebase.put(f"users/{session['user_id']}/",'healthTip',new_message)
        
        return new_message
    else:
        print("Tarif geçmişi bulunamadı.")
        recipes_string = ""
        print("--------------------------")
        return recipes_string
    
    
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


if __name__ == "__main__":
    app.run(debug=True)
