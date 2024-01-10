var config = {
  phone: "9634396572",
  call: "Help!",
  position: "ww-right",
  size: "ww-normal",
  text: "",
  type: "ww-standard",
  brand: "",
  subtitle: "",
  welcome: "",
};
var proto = document.location.protocol,
  host = "cloudfront.net",
  url = "https:" + "//d3kzab8jj16n2f." + host;
var s = document.createElement("script");
s.type = "text/javascript";
s.async = true;
s.src = url + "/v2/main.js";

s.onload = function () {
  tmWidgetInit(config);
};
var x = document.getElementsByTagName("script")[0];
x.parentNode.insertBefore(s, x);
