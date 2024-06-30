//Http modülünü çağırdık
//*require ile import ederiz backend de
const { log } = require("console");
const http = require("http");
const fs = require("fs");
const replaceTemplate = require("./modules/replaceTemplate.js");
const url = require("url");

//Apı gelen istekleri izler ve cevap verir

/*
 *createServer metoduna verdiğimiz dinleyici fonksiyon her api isteği alındığında tetiklenir
 *Bu fonksiyon iki parametre alır
 *1)request > istek ile alakalı veriler
 *2)response > gönderilecek cevap

 *Bu fonksiyon içerisinde her gelen isteği dinleyip bir cevap göndericez
 */

//*Cevabı response.end  ile göndeririz
//*Aşağıda bir sunucu oluşturduk
//*Serverla alakalı birşey yapıldığında serverı durdur ctrl+c ile daha sonra tekrar başlat node index.js ile terminalde
//*Aşğıda console.log("istek tesipt edildi") kısmını sayfa yeniledikten sonra terminalde görebilirsin

/*
*Routing:
*Apı a gelen  isteğin hangi (uç nokta )enpoint'e gelceğini tespit edip ona göre cevap gönderme işlemine  routing denir.
*Routing için client'ın hangi yola ve hangi http methodu ile istek attığını bilmemiz gerekiyor
*if else ile sayfa durumlarını yönetiyoruz eğer anasayfadaysa şuan anasayfadısınız cevabını versin gibi enson bilinmeyen url girildiğinde
*response.end("<h1>SAYFA BULUNAMADI</h1>"); yaparız client'ın karşısına o çıkar
*Aynı durum switch case ile daha derli toplu olucaktır
*NODEMON SADECE JAVASCRİPTİ GÜNCELLEYİP DURUR EĞER HTML GÜNCELLEMEK İSTİYORSAK TERMİNALE rs yazığ entera basmammız gerekiyor

*/
//*Anasayfa için html dosyasnın içeriğini oku

let tempOverview = fs.readFileSync("./templates/overview.html", "utf-8");
//*Detay sayfası için html dosyasnın içeriğini oku
let tempProduct = fs.readFileSync("./templates/product.html", "utf-8");
//Card sayfasını oku
let tempCard = fs.readFileSync("./templates/card.html", "utf-8");
//ürün verilerini oku(json formatında alır)
const data = fs.readFileSync("./dev-data/data.json", "utf-8");
//*Json formatındaki verinin Javascript yani index.js  tarafında okunabilmesi için json veri tipini js veritipine çevirmemiz gerekiyor key değerlerinde tırnak işareti olamaması gerekiyor yani "id" ise id olması gerikyor ve onun JSON.parse metodunu kullanırız
const dataObj = JSON.parse(data);
console.log(data);

const server = http.createServer((request, response) => {
  console.log("Url'i gör", request.url); //product?id="1"
  //*Url'i parçalara ayırır
  const { pathname, query } = url.parse(request.url, true);

  console.log("istek tespit edildi");
  console.log("İSTEK :D :D", request);

  switch (pathname) {
    case "/overview":
      //*Meyveler verisini dön dizideki eleman sayısı kadar card oluştur
      //*El burda bilgilerini tempcard ın içine yediriyor
      const cards = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
      //*Overview sayfsındaki {%PRODUCT_CARDS%} kısmı yerine card verisini gönder
      //*ve onun için de replace metodunu kullanırız yani bir şeyin yerine birşey getirmek için kullanılır metod
      //*Eğer bütün bu şekilde dinmaik verileri değiştirmeyi bu şekilde sağlarsak burada kod kalabalığı olcağından
      //*Ayrı bir modules dosyası oluşturmlıyız
      const overviewOutput = tempOverview.replace("{%PRODUCT_CARDS%}", cards);
      response.writeHead(200, { "Content-Type": "text/html" });
      return response.end(overviewOutput);
    //*detay kısmına tıkladığımızda product?id="1" parametresiyle açılıyor ve  sayfası gelmiyor
    //*Ama normalde product yazdığımızda url e geliyor parametreli bir biçimde gelmiyor
    //*Case e doğrudan product?id="1" yazdığımızda açılır ama bu doğru olmaz çünkü detay kısmını id si farklı olucak şekilde yazılmıştır
    //*Bu durumda url'i parse etmemiz gerekebilir
    case "/product":
      //*
      // urldeki id'li ürünü dizide bul
      const product = dataObj[query.id];
      console.log("asdasd", product);
      // detay sayfasının html'ini ürünün bilgilerine göre düzenle
      const output = replaceTemplate(tempProduct, product);
      "";
      return response.end(output);

    default:
      return response.end("<h1>ARANAN SAYFA BULUNAMADI</h1>");
  }

  //   response.end("Server tarafindan selamlar");
});
//*Bir dinleyici oluşturup hangi adrese gelen istekleri dinleyeceğimizi söylemeliyiz

server.listen(4008, "127.0.0.1", () => {
  console.log("Server 4008 nci portta gelen istekleri dinlemeye başladı");
});

//*Her değişiklikte durdur başlat yapmak artık zor olduğundan nodemon kütüphanesini kullanırız otomatik durdur başlat yapar
//*Aynı zamanda bütün kütüphaneleri dahil ederken bu şekilde bir yöntem uygularız
//1)projeyi durdur ctrl+c ile
//2)Projeye npm'i dahil et npm init ile
//3)Eğer nodemon npm i kurucaksan kesinlikle development olan kısmın yazdığı yerin npm'ni al
