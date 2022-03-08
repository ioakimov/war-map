$( document ).ready(function() {
    var tiles = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		  maxZoom: 18,
		  attribution: '&copy; <a href="//openstreetmap.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ'
		});
		bounds = new L.LatLngBounds(new L.LatLng(44.3614785833,22.0856083513), new L.LatLng(52.3350745713, 40.0807890155));
		var map = L.map('map', {
		  center: bounds.getCenter(),
		  maxBounds: bounds,
  		  maxBoundsViscosity: 0.75,
		  zoom: 6,
		  layers: [tiles]
		});

		var mcg = L.markerClusterGroup({
		  chunkedLoading: true,
		  spiderfyOnMaxZoom: false
		});

		const HOST = "https://charity-now.com/";

		$.ajax({
			type: "GET",
			url: HOST + "data/points.csv",
			dataType: "text",
			success: function(data) {processData(data);}
		});
	
		// Let's process the data from the data file
		function processData(csvStr) {
			let addressPoints = csvStr.split("\n").map(function(row){return row.split(",");})
			console.log("AddressPoints:", addressPoints.length);
			for (var i = 0; i < addressPoints.length; i++) {
				let a = addressPoints[i];
				let id = a[2];
				let title = "Building#" + id;
				if (!a[0] || !a[1]) {
					continue;
				}
				var marker = L.marker(new L.LatLng(a[0], a[1]), {
				  title: title
				});
				marker.bindPopup((layer)=>{
					var el = document.createElement('div');
					el.className = "popup";

					$.getJSON(HOST + "data/" + Math.floor(Math.random() * (3 - 1 + 1) + 1) + "/data.json",function(pointData) {
						var slideshowContent = '';					
						for(var i = 0; i < pointData.images.length; i++) {
							slideshowContent += '<div class="image' + (i === 0 ? ' active' : '') + '">' +
								'<img src="' + HOST + pointData.images[i] + '" />' +
								'</div>';
						}
						let popupContent =  "<div id='point" + id + "' class='popup'>" +
							"<a target='_blank' href='point/" + id + "'><h2><font color='red'>" + "Building #" + id + "</font></h2></a>" +
							"<h3>" + pointData.city + ", " + pointData.street + " "  + pointData.buildingNumber + "</h3>" +
							"<div class='caption'>" +
							"<p>Building type: " + pointData.buildingType + "</p>" +
							"<p>Source of destruction: <font color='red'>" + pointData.destractionSource + "</font></p>" +
							"</div>" +
							"<div class='slideshow'>" +
							slideshowContent +
							"</div>" +
							"<div class='cycle'>" +
							"<a href='#' class='prev'>&laquo; Previous</a>" +
							"<a href='#' class='next'>Next &raquo;</a>" +
							"</div>" +
						"</div>";
						el.innerHTML = popupContent;
					});							   
					return el;
				});
				mcg.addLayer(marker);
			}	  
			map.addLayer(mcg);
		}

		$('#map').on('click', '.popup .cycle a', function() {
			var $slideshow = $('.slideshow'),
				$newSlide;
		
			if ($(this).hasClass('prev')) {
				$newSlide = $slideshow.find('.active').prev();
				if ($newSlide.index() < 0) {
					$newSlide = $('.image').last();
				}
			} else {
				$newSlide = $slideshow.find('.active').next();
				if ($newSlide.index() < 0) {
					$newSlide = $('.image').first();
				}
			}
		
			$slideshow.find('.active').removeClass('active').hide();
			$newSlide.addClass('active').show();
			return false;
		});
});