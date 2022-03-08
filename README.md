-------------------------------------------
Current prototype:
-------------------------------------------

GET `/data/{pointId}/data.json`

Result:
```json
{
	"title": "Building #1",
	"region": "#### область",
	"city": "####",
	"street": "Правди",
	"buildingNumber": "31",
	"buildingType": "School",
	"destractionSource": "Russian Missle",
	"renowationPossibility": "No",
	"images":[
		"data/1/images/1.jpg",
		"data/1/images/2.jpg",
		"data/1/images/3.jpg"
	],
	"videos": []
}
```
-------------------------------------------
GET `/points/points.csv`

	lat, lon, id
	lat, lon, id


-------------------------------------------
TODO Prototype (alfa):
-------------------------------------------
####BE:

1. GET `/data/{pointId}`

2. GET `/data/`

3. Any DB but preferably with geo search (DynamoDB on AWS, or Postgres+PostGis on some other server)
4. CRUD for points (Lambda on AWS)
5. Script to migrate current CSV points to DB via CRUD
6. CRON JOB for data migration from GoogleSheets into DB via CRUD (images will stay on google drive in public folder)

####After that:
####FE:

1. Use new endpoints
2. Separate detail page /point/{id}
3. Test popup styles (for points without images or using images with different size, for long addresses)
4. Add beautiful header


-------------------------------------------
TODO Prod (beta):
-------------------------------------------
####BE:

1. Agorithm for dynamic clustering within boundaries
2. GET(accept=TEXT)  `/data?latX=1&lonX=1&lonY=99&latY=99&zoom=6`
    ```
    lat, lon, nodeType, id, optionalField
    lat, lon, nodeType, id, optionalField
    ```
    nodeType: 1 - for Cluster, 0 - for regular marker

    Example:

    `40.1, 30.8, 1, "dynamicClusterUUID", 37`
    
    `40.7, 30.1, 0, "point99"`

    ---> 37 is number of points in cluster

3. Authentification for CRUD & * endpoints

4. CRON JOB for data migration should copy images to amazon bucket and store new URL in DB

####FE:
1. Login page
