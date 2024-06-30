//*Card html'ini ve ürün bilgilerini alıp
//*Card html'inde değişken olarak tanımlanan {%PRODUCT_CARDS%}  bütün değerlerin yerine ürün bilgilerini data.jsondaki  productName aktaran fonksiyon

const replaceTemplate = (cardHtml, data) => {
  let output = cardHtml.replace(/{%PRODUCTNAME%}/g, data.productName);
  output = output.replace(/{%QUANTITY%}/g, data.quantity);
  output = output.replace(/{%PRICE%}€/g, data.price);
  output = output.replace(/{%ID%}/g, data.id);
  output = output.replace(/{%IMAGE%}/g, data.image);
  output = output.replace(/ {%FROM%}/g, data.from);
  output = output.replace(/{%NUTRIENTS%}/g, data.nutrients);
  output = output.replace(/{%DESCRIPTION%}/g, data.description);
  //*Eğer ürün orginc değilse not-organic ifadesi ekle
  if (!data.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  //*Oluşturduğumuz html'i gönder
  return output;
};

//*replaceTemplate isimli fonksiyonu projedeki diğer dosyalardan erişilebilir
//*Hale getirmek için module.export ediyoruz sadece backend kısmı için bu export yöntemi kullanılır

module.exports = replaceTemplate;
