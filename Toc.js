class Toc{
    constructor(tocElement,maplayer,mapview){
		 this.mapview=mapview;
         this.tocElement=document.getElementById(tocElement);
         let toc=this.tocElement;
		 toc.innerHTML="";
		 let layerlist = document.createElement("ul");
		 toc.appendChild(layerlist);
		 this.populateLayerRecursive(maplayer,layerlist);
		 
    }
    populateLayerRecursive(thislayer,layerlist)
		{

			let chk = document.createElement("input");
			chk.type="checkbox";
			chk.value=thislayer.id;
			chk.checked=thislayer.visible;
			chk.addEventListener("click",function(e)
			{
				
				thislayer.visible=e.target.checked;

			}
			)
			let lbl=document.createElement("label");
			lbl.textContent=thislayer.title+"    ";
			let bttn=document.createElement("button");
            bttn.layerid=thislayer.id;
            bttn.layerURL=thislayer.url;
			bttn.textContent="View";
			bttn.mapview=this.mapview;		
			bttn.addEventListener("click",this.openAttributeTable);

			let layeritem = document.createElement("li");
			layeritem.appendChild(chk);
			layeritem.appendChild(lbl);
			layeritem.appendChild(bttn);
			layerlist.appendChild(layeritem);

			if(thislayer.sublayers !=null &&  thislayer.sublayers.items.length > 0)
			{
				for (let i = 0 ; i < thislayer.sublayers.length; i++)
				{
					let sublayer = thislayer.sublayers.items[i]
					let newlayerlist=document.createElement("ul")
					layerlist.appendChild(newlayerlist)
					this.populateLayerRecursive(sublayer,newlayerlist)
				}
			}
	
		}
	openAttributeTable(e)
		{
			let attributeTable=new AttributeTable(e.target.layerURL,e.target.mapview);
		}
	}
