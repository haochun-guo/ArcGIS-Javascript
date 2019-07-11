class AttributeTable{
    constructor(mapServiceLayerURL){
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
    populatePages(featureCount)
		{
			let pageCount=Math.ceil(featureCount/DEFAULT_PAGE_SIZE)
			let pageNums=document.getElementById("pagesNums")
			pageNums.innerHTML=""
			let instance=this
			for (let i=0;i<pageCount;i++)
			{
				let button=document.createElement("button")
				button.textContent=i+1
				this.buttonPages.push(button)
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
				let queryoptions={
					responseType:"json",
					query:{
						where:"1=1",
						returnCountOnly:true,
						f:"json" 
					}
				}
				Request(queryurl,queryoptions).then(
					response=>featureCount(response.data.count),
					response=>featureCount(0))
			
		}
    populateAttributeTable(pageNum)
		{		
			let queryurl=this.mapServiceLayerURL+"query";
			let attributeTable=document.getElementById("attributetable");
			attributeTable.innerHTML=""
			let queryoptions={
				responseType:"json",
				query:{
					where:"1=1",
					outFields:"*",
					resultOffset:(pageNum-1)*DEFAULT_PAGE_SIZE+1,
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
					for (let i = 0; i <response.data.fields.length; i++)
					{
						let field=response.data.fields[i]
						let col=document.createElement("td");
						if (field.type ==  "esriFieldTypeDate")
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