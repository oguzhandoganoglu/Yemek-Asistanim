Amaç: Yemek Asistanım kullanıcıların yemek alışkanlıklarını, alerjilerini ve
bulundukları ülkeleri dikkate alarak yemek tarifleri sunan yapay zeka destekli
bir web uygulaması olarak geliştirilmiştir.

Kullanıcı Senaryosu 1:
Kullanıcı Senaryosu Adı : Alerjenlere, intoleranslara uygun beslenme
Aktör : Alerjisi olan / intoleranslı kullanıcı
Amaç : Belli bir grup malzemeden kesinlikle kaçınmak
isteyen kullanıcıya uygun tarif önerilmesi
Ana Senaryo:
1. Öncelikle kullanıcı uygulamamıza kayıt olur. Kayıt sırasında kullanıcı
alerjen olduğu ya da intoleransı olduğu besinleri işaretler.
2. Kullanıcı bir yemek tarifi ister. Uygulamamız varsa daha önce seçilmiş
diğer tercihleri ve kaçınılması gereken malzemeleri göz önünde
bulundurarak ona bir yemek tarifi önerisi getirir.
3. Beğendiği bir yemek tarifi gelene kadar yemek tarifi kartının altındaki
hayır butonuna basarak neden belirterek veya belirtmeyerek yeni bir tarif
alabilir.
4. Daha sonra verilen yemek tarifini yaptığını söyleyen yani evet butonuna
basan kullanıcımızın tarif geçmişine bu tarif eklenir.
5. Kullanıcı Profil kısmından tarif geçmişini sıfırlamadığı sürece
kullanıcının evete bastığı tarifler kaydedilir.

4.1.	Yemek Asistanına Kayıt İşlemi
Yemek Asistanına kullanıcıların kayıt olması için gerekli olan bir arayüzdür. Arka planda çalışan “firebase” sunucumuza istek atılarak işlem tamamlanır.
 <img width="376" alt="image" src="https://github.com/oguzhandoganoglu/Yemek-Asistanim/assets/78206007/bae74a82-5662-4991-aa2f-8821baf8dcd7">


 

4.2.	Yemek Asistanına Email ve Parola ile Giriş
Yemek Asistanına kullanıcıların giriş işlemi için gerekli olan arayüzdür. Arka planda çalışan “firebase” sunucusuna istek atarak bu işlem tamamlanır.
 <img width="378" alt="image" src="https://github.com/oguzhandoganoglu/Yemek-Asistanim/assets/78206007/26ada8d2-8f8a-4554-868a-6e31692f7274">

 

4.3.	Yemek Asistanı Tarif Önerme
Yemek Asistanı uygulamamızda kullanıcıların yemek tarifleri alabilecekleri arayüzdür. Burada kullanıcıların “Tarif Öner!” butonuna bastıklarında, geçmiş yemek alışkanlıklarını, alerjileri ve ülke bilgilerini “firebase” sunucumuzdan alarak daha sonrasında asistana tarif için istekte bulunuluyor. Ekrana uygun tarif çıktısı veriliyor.
<img width="402" alt="image" src="https://github.com/oguzhandoganoglu/Yemek-Asistanim/assets/78206007/6d62f30d-170f-4a78-9b24-9d3ad3cde8ed">

 
4.3.1.	Yemek Asistanı Tarifi Kabul Etme
Yemek Asistanı uygulamamızda kullanıcı gelen tarifi beğendiğini ve yapacağını belirtmek için “Yes” butonuna basması yeterli oluyor. İlgili tarif yapılan yemekler arasına ekleniyor.
<img width="386" alt="image" src="https://github.com/oguzhandoganoglu/Yemek-Asistanim/assets/78206007/ea0a8ee6-bb51-4a03-9e62-eb588711b5c9">

 
4.3.2.	Yemek Asistanı Tarifi Kabul Etmeme
Yemek Asistanı uygulamamızda kullanıcı gelen tarifi beğenmediğini ya da beslenme şekline uygun olmadığını belirtmek için “No” butonuna basması yeterli oluyor. İlgili tarifi neden beğenmediğini veya neden beslenme şekline uygun olmadığını “Tell us why you didn’t like the recipe:” textbox’a girmesi daha sonra “Submit” butonuna basıyor.  Bu sayede arka planda ilgili nedenin benzerlik sorguları Qdrant apisi ile yapılıyor ve gelen sonuçlara göre “firebase”de kullanıcının diets bölümüne ekleniyor.
<img width="348" alt="image" src="https://github.com/oguzhandoganoglu/Yemek-Asistanim/assets/78206007/72a84e2c-8aa6-4bdf-9725-ebf875592b81">

 
4.4.	Yemek Asistanı Sağlık Önerileri
Kullanıcının beğenip yaptığı tariflere “Yes” butonuna bastıktan sonra bu tarifler kullanıcının tarif geçmişine kaydolur. Sağlık önerisi sayfasında ise bu tarif geçmişi üzerinden kullanıcıya özel sağlık önerisinde bulunur. Bu öneri genel değerlendirme, tavsiyeler, diyet önerisi olarak üç kısımdan oluşur ve kullanıcı istediği zaman bu öneriyi günceller. Güncellenen öneri tarif geçmişinin son haline göre yapılır.
<img width="445" alt="image" src="https://github.com/oguzhandoganoglu/Yemek-Asistanim/assets/78206007/4365db9f-f56d-4fb6-ba2c-8838786df8c9">

 
4.5.	Yemek Asistanı Diyet Listeleme, Ekleme, Silme
Kullanıcı tarif beğenmediğinde yani “No” butonuna bastıktan sonra gelen neden beğenmediği sorulan kısımda eğer bir sebep belirtirse bu sebep analiz edilerek diyetlere ekleme yapılabilir. Mesela “I do not eat meat or anything animal related” dediğinde vegan diyeti kullanıcının diyet listesine ekler. Kullanıcı diyet listesini Diyetler sayfasından istediği zaman görüntüleyebilir ve istediği zaman artık takip etmedği diyetleri kaldırabilir. 
 <img width="449" alt="image" src="https://github.com/oguzhandoganoglu/Yemek-Asistanim/assets/78206007/b2c7b57e-338d-4b15-abc9-92999a43e972">

 
4.6.	Yemek Asistanı Alerji Listeleme ve Değiştirme
Sayfa, kullanıcıyı çeşitli alerji türlerini içeren bir panel ile karşılar. Bu panelde, her alerji türü için bir checkbox ve bu alerjilerin isimlerini belirten bir label bulunur. Kullanıcılar, panelde yer alan checkbox'ları işaretleyerek veya işareti kaldırarak kendi alerji profillerini güncelleyebilirler. Bir checkbox işaretlendiğinde, bu durum bir HTTP request aracılığı ile backend'e iletilir ve Firebase veritabanında ilgili kullanıcının alerji bilgisinde bu tür için değer true olarak güncellenir. Eğer işaret kaldırılırsa, değer false olarak ayarlanır. Kullanıcının alerji seçimleri default olarak false değerindedir, ancak kullanıcı kayıt olurken veya önceki girişlerinde yapmış olduğu seçimler, veritabanında saklanır ve kullanıcı sayfayı ziyaret ettiğinde bu seçimler frontend tarafında gösterilir. 
<img width="448" alt="image" src="https://github.com/oguzhandoganoglu/Yemek-Asistanim/assets/78206007/af2efd4a-114f-4ceb-a7cc-823d8bcc84bc">

 
4.7.	Yemek Asistanı Profil Görüntüleme, Ülke Değiştirme ve Geçmiş Tariflerin Sıfırlanması
Bu ekran, kullanıcının kullanıcı adı ve e-posta gibi temel kimlik bilgilerinin yanı sıra, ülke bilgisini içerir. Kullanıcı, bu ekran üzerinden ülke seçimi yapabilir; bu tercih, OpenAI tarafından sağlanan yemek tariflerinin kişiselleştirilmesinde temel bir faktör olarak işlev görür. Örneğin, bir kullanıcı Türkiye’yi seçtiğinde, Türk mutfağına özgü tarifler ve yemekler ön plana çıkar. Ekranın alt kısmında yer alan buton ise kullanıcıya özel tarif geçmişini sıfırlamak için kullanılır. Bu butona basıldığında, kullanıcının daha önce eriştiği ve kaydettiği tariflerin kaydı temizlenir, böylece yeni bir başlangıç noktası oluşturulmuş olur. Bu özellik, kullanıcıların deneyimlerini daha temiz bir slate üzerinden yeniden şekillendirmelerine olanak tanır ve daha önceki seçimlerinin üzerine yeni tercihler inşa etmeleri için bir fırsat sunar. Bu profil ekranı, kullanıcıların kişisel bilgilerini güvenli bir şekilde yönetmelerini ve yemek tercihlerini kişiselleştirmelerini sağlayarak, uygulamanın kullanıcı dostu ve etkileşimli bir deneyim sunmasına katkıda bulunur.
<img width="403" alt="image" src="https://github.com/oguzhandoganoglu/Yemek-Asistanim/assets/78206007/8a45d087-99e9-4938-8bf4-7c83e806d1fe">
<img width="415" alt="image" src="https://github.com/oguzhandoganoglu/Yemek-Asistanim/assets/78206007/d2d30556-d8af-48e2-a76d-591ce655ecc3">

Sistem Mimarisi
<img width="454" alt="image" src="https://github.com/oguzhandoganoglu/Yemek-Asistanim/assets/78206007/524b75fc-db70-4095-b449-aea1e25574e9">

 
Veritabanı Şeması
<img width="454" alt="image" src="https://github.com/oguzhandoganoglu/Yemek-Asistanim/assets/78206007/965c3469-cc54-41ae-bc58-4ba0175ec6a7">


