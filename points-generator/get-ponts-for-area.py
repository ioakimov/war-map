import time
import requests
import json
import csv
import os

overpass_url = "http://overpass-api.de/api/interpreter"

areas = ["Донецька область", "Луганська область", "Харківська область", "Запорізька область", "Херсонська область", "Сумська область", "Чернігівська область", "Житомирська область"]


currentId = 1
coords = []
for areaName in areas:
    time.sleep(30)
    overpass_query = """
    [out:json];
    (
        area[name="{areaName}"];
    );
    (
      nwr["bus"](area);
    );out;
    """.format(areaName=areaName)

    response = requests.get(
        overpass_url, 
        params={'data': overpass_query}
    )

    itemsInArea = 0;
    broken = 0

    if response.status_code == 200:
        data = response.json()
        # with open('json_data.json', 'w') as outfile:
        #     outfile.write(json.dumps(data, indent=4))
        places = data.get('elements', [])
        for place in places:
            lat = place.get('lat')
            lon = place.get('lon')
            currentId += 1
            if lat and lon:
               item = [lat, lon, currentId] 
               coords.append(item)
               itemsInArea += 1
            else:
               broken += 1
        print (f"Got {itemsInArea} nodes coordinates for {areaName}!")
        print ("Got %s broken nodes!" % broken )
    else:
        print(response)

with open("result.csv", "a") as f:
    writer = csv.writer(f)
    writer.writerows(coords)

# Get the current working directory
cwd = os.getcwd()
# Print the current working directory
print("Current working directory: {0}".format(cwd))