
class AttributeTable{
    constructor(mapServiceLayerURL,mapview){
		this.mapview=mapview;
        this.buttonPages=[];
        this.mapServiceLayerURL=mapServiceLayerURL+"/";
		let featureCount=0;
		this.getCount(c =>{
				featureCount=c;
				this.populatePages(featureCount);
				this.populateAttributeTable(1);

			});
    }
	resetButtonCol()
		{
			this.buttonPages.forEach(b=>{
				b.style.color="black"
			})
		}
    populatePages(featureCount,initialPage=1)
		{
			let pageCount=Math.ceil(featureCount/DEFAULT_PAGE_SIZE)
			let pageNums=document.getElementById("pagesNums")
			//pageNums.innerHTML=""
			while(pageNums.firstChild) pageNums.removeChild(pageNums.firstChild)
			let instance=this
			for (let i=0;i<pageCount;i++)
			{
				let button=document.createElement("button")
				button.textContent=i+1
				this.buttonPages.push(button)
				if (i+1===initialPage) button.style.color="red"
				button.addEventListener("click",function(e){
					instance.resetButtonCol()
					e.target.style.color="red"
					instance.populateAttributeTable(button.textContent)
				})
				pageNums.appendChild(button)
			}

        }
    getCount(featureCount) 
		{
				//mapServiceURL sample "https://sampleserver6.arcgisonline.com/arcgis/rest/services/"+selectedLayer+"/MapServer/"
				let queryurl=this.mapServiceLayerURL+"query"
				let extent=undefined
				if(this.mapview.useExtent) extent=JSON.stringify(this.mapview.extent)
				let queryoptions={
						responseType:"json",
						query:{
							geometry:extent,
							geometryType:"esriGeometryEnvelope",
							inSR:JSON.stringify(this.mapview.extent.spatialReference),
							spatialRel:"esriSpatialRelIntersects",
							where:"1=1",
							returnCountOnly:true,
							f:"json" 
						}
					}
				Request(queryurl,queryoptions).then(
					response=>featureCount(response.data.count),
					response=>featureCount(0))
			
		}
	zoomIn(e){
		let oid=e.target.oid;
		let url=e.target.url;
		//alert(oid+"-"+url);
		let queryURL= url+"query"
		let queryoptions={
			responseType:"json",
			query:{
				f:"json",
				objectIds:oid,
				returnGeometry:true,
				outSR:4326
			}
		}
		Request(queryURL,queryoptions)
		.then(
			response=>{
				//alert(JSON.stringify(response.data));
				//alert(JSON.stringify(response.data.features[0].geometry));
				mapview.goTo(response.data.features[0].geometry);
				drawGeometry(response.data.features[0].geometry);

			}
			//response=>{alert("SUCCESS"+JSON.stringify(response))}
			
		)
		//.catch(err=>rejects(alert("ERR"+err)))
	}
    populateAttributeTable(pageNum)
		{		
			let queryurl=this.mapServiceLayerURL+"query";
			let attributeTable=document.getElementById("attributetable");
			attributeTable.innerHTML=""
			let extent=undefined
			if (this.mapview.useExtent) extent=JSON.stringify(this.mapview.extent)
		
			let queryoptions={
					responseType:"json",
					query:{
						where:"1=1",
						geometry:extent,
						geometryType:"esriGeometryEnvelope",
						inSR:JSON.stringify(this.mapview.extent.spatialReference),
						spatialRel:"esriSpatialRelIntersects",
						outFields:"*",
						resultOffset:(pageNum-1)*DEFAULT_PAGE_SIZE,
						resultRecordCount:DEFAULT_PAGE_SIZE,
						f:"json"
					}
				}

			
			
			Request(queryurl,queryoptions).then(response=>
			{
				let table=document.createElement("table");
				table.border=1.5;
				let header = document.createElement("tr");
				table.appendChild(header);
				let zoomHeader = document.createElement("th");
				zoomHeader.textContent="Zoom In";
				header.appendChild(zoomHeader);
				for (let i = 0; i < response.data.fields.length; i++)
				{
					let col=document.createElement("th");
					col.textContent=response.data.fields[i].alias;
					header.appendChild(col);
				}
				
				for (let j = 0;j < response.data.features.length; j++)
				{
					let feature= response.data.features[j];
					let row = document.createElement("tr");
					table.appendChild(row);
					// let buttonZoomIn=document.createElement("button");
					// row.appendChild(buttonZoomIn);
					let zoomColum = document.createElement("td");

					//zoomColum.textContent="Zoom";
					//zoomColum.innerHTML="<img style='width:20px;height:20px' src='images/zoom.svg' />"
					
					//zoomColum.url=this.mapServiceLayerURL;
					//zoomColum.addEventListener("click",this.zoomIn);
					let image=document.createElement("img");
					image.style.width="20px";
					image.style.height="20px";
					image.src="images/zoom.svg";
					image.url=this.mapServiceLayerURL;
					image.addEventListener("click",this.zoomIn);
					zoomColum.appendChild(image);
				    row.appendChild(zoomColum);
					for (let i = 0; i <response.data.fields.length; i++)
					{
						let field=response.data.fields[i]
						let col=document.createElement("td");
						if(field.type==="esriFieldTypeOID")
						{
							image.oid=feature.attributes[field.name];

						}
						if (field.type ===  "esriFieldTypeDate")
						{
							let date = new Date(feature.attributes[field.name]);
							col.textContent=date;
							row.appendChild(col);

						}
						else
						{
						   col.textContent=feature.attributes[field.name];
						   row.appendChild(col);

						}
						
					}
				}
				attributeTable.appendChild(table)


			}
			)

		}
}