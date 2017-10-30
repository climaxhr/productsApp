var ProductsApp = function (userOptions){

	var options = $.extend({
		"callback" : false,
		"templateEl" :  $("#products-modal .products-list-item.template"),
		"selectedProduct" : false
	}, userOptions);
	
	var thisApp = this;
	
	var productId = 0;

	var service = new Service({
		"frontend" :false,
		"backend" :false,
		"printRecived" : false,
		"printFrontendCallback" :false,
		"serviceURL" : 'apps/productsApp/productsApp.php',
		"secure" : false
	});

	thisApp.show = function(showOptions){
	 
	 	$.extend(options, showOptions);

	 	$("#products-modal").modal("show");
	 	
	};

	thisApp.load = function(cats, types){

$( ".fixed, .movable , .other").html("");

		service.post("load", new Array(cats, types), function(recived){
			
			thisApp.products = recived;

			$.each(thisApp.products,function(index, product){


				if(product.category == "2"){
					$( ".fixed").append(thisApp.productTemplate(product, function (){ thisApp.selectedProduct = product; options.callback(); }));
				};
				if(product.category == "3"){
					$( ".movable").append(thisApp.productTemplate(product, function (){ thisApp.selectedProduct = product;options.callback(); }));
				};
				if(product.category == "4"){
					$( ".other").append(thisApp.productTemplate(product, function (){ thisApp.selectedProduct = product;options.callback(); }));
				};

			});

		});

	};


	thisApp.productTemplate = function(product, callback){

		var t = options.templateEl.clone();

		t.find(".product-name").css("color", product.color);
		t.find(".product-name").text(product.name);
		t.find(".product-long-name").text(product.long_name);
		t.find(".product-price").text(product.price);
		t.find(".product-name").css("background-color",product.color);

	    t.on("click",function(){
	     callback(); 
	    });

		t.removeClass("template");
		return t;

	};
	
	thisApp.hideProducts = function(){
	    $("#products-tabs").hide();
        $("#product-details").show();
        $("#btn-save-new-product").show();
        $("#btn-back-product").show();
	};


	thisApp.hideDetails = function(){
        $("#product-details").hide();
        $("#btn-save-new-product").hide();
        $("#btn-back-product").hide();
        $("#products-tabs").show();
    };

thisApp.save = function(){
        var data = harvestData(".product-data","product-");

        service.post("save", [data], function(rec){
    
        thisApp.load("2,3,4", "1,2,3");

        guiApp.infoAlert(rec);

    });   	
};

thisApp.update = function(){
        var data = harvestData(".product-data","product-");
       
        service.post("update",[data, productId], function(rec){      
        thisApp.load("2,3,4", "1,2,3");
    });     
};

thisApp.init = function(){
	/* load categories an types
2,3,4 su kategorije fixed, movable... a 1,2,3 su tipovi prouozvoda 
//oni mogu biti 1 usluga 2 proizvod 3 kombinirani, ugl loadamo sve tri vrste
	*/
       thisApp.hideDetails();

	   guiApp.registerLink("Products", function(){

	   productsApp.show( {"callback" : function(){
                                           
       //guiApp.infoAlert("Clicked on : " + thisApp.selectedProduct.id);
       $("#btn-save-new-product").html("Update Product");
       thisApp.hideProducts();
       
       productId = thisApp.selectedProduct.id;
       seedData(".product-data", "product-", thisApp.selectedProduct);                                  
       }});
	}, "app");

  	thisApp.load('2,3,4','1,2,3');

	setTimeout(function(){
		scroll($(".products-dropdown-menu"));
	},1000);
	
scroll($("#product-details"));

thisApp.events();

};

thisApp.events = function(){

	$("#btn-products-hide").click(function(){

	 	options.callback();
	  	$("#products-modal").modal("hide");

	});
	
	
	$("#btn-new-product").click(function(){
	    productId = 0;
	    $("#btn-save-new-product").html("Save new Product");
	  	thisApp.hideProducts();
	  	$("input").each(function(){
           $(this).val(''); 
        });
               
	});
	
	$("#btn-save-new-product").click(function(){

        if(productId==0){
            thisApp.save();    
        }else{
           thisApp.update(); 
        }
        
        thisApp.hideDetails(); 
                
        $("input").each(function(){
           $(this).val(''); 
        }); 

    });
	
	
	
	$("#btn-back-product").click(function(){
            
        thisApp.hideDetails(); 
        
        $("input").each(function(){
           $(this).val(''); 
        });
        
    });

};

thisApp.init();

};