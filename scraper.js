var resolve = require('url').resolve;
var needle = require('needle');
var cheerio = require('cheerio');
var fs = require('fs');

var URL = 'http://prokatpalatok.ru/';

var results = [];

var urlList = [];

needle.get(URL, function(err, res){
	if (err) throw err;
	var $ = cheerio.load(res.body);

	$('#content>a[href]').each(function(){
		var ref = String($(this).attr('href'));
		needle.get(resolve(URL, ref), function(err, res){
		if (err) throw err;
		var $ = cheerio.load(res.body);
		var quantity = 0;
		if ($('td>p').eq(0).text().trim()==='первые сутки'){
			quantity = 1;
		}else{
			quantity = 2;
		};
		results.push({
			"name": $('#center>h1').text().trim(),
		    "descr": $('#center>p').eq(0).text().trim(),
		    "price": Number($('td:contains("Залог")').siblings().eq(0).text().trim().substr(0, $('td:contains("Залог")').siblings().eq(0).text().trim().indexOf('руб'))),
		    "youtube_link": null,
		    "is_ready_to_sale": false,
		    "price_buy": "",
		    "deposit": $('td>p').eq(7).text().trim().substr(0, $('td>p').eq(7).text().trim().indexOf('руб')),
		    "state": 3,
		    "features": [{"name":null, "quantity": null}],
		    "equipments": [{"name":"деталь", "quantity": "1"}],
		    "priceOptions": [
		      {
		        "price": $('td>p').eq(1).text().trim().substr(0, ($('td>p').eq(7).text().trim().indexOf('руб')-1)),
		        "quantity": quantity,
		        "category": "2"
		      }
		    ],
		    "car_delivery": false, 
		    "loader_wanted": false, 
		    "far_delivery": false, 
		    "handwriting_tags": [
		      "Снаряжение" 
		    ],
		    "shipping_type": "pickup",
		    "urlPhotos": [
		      resolve(resolve(URL, ref),String($('.bigbox').attr('src')))
		    ],
		    "location": {
		      "address": "г. Санкт-Петербург, Витебский пр. 99 корп. 2", 
		      "lat": "59.830452",
		      "lng": "30.370978"
		    },
		    "tag_ids": [
		      null
		    ],
		    "url": resolve(URL, ref)

			});
			fs.writeFileSync('./data.json', JSON.stringify(results, null, 2));
	});

	});
	    
});

