jQuery(document).ready(function($) {
	var ie 			= false;
	if ($.browser.msie) {
		ie = true;
	}
	//current album/image displayed 
	var enableshow  = true;
	var current		= -1;
	var album		= -1;
	//caching
	var $albums 	= $('#fp_thumbContainer div.album');
	var $loader		= $('#fp_loading');
	var $next		= $('#fp_next');
	var $prev		= $('#fp_prev');
	var $images		= $('#fp_thumbContainer div.content img');
	
	//we wnat to spread the albums through the page equally
	var nmb_images	= $images.length;
	var loaded  	= 0;
	var nmb_albums	= $albums.length;
	var cnt			= 0;
	//memorize global states
	$.open_album = '';
	
	//Darkroom variables
	var base_margin = 100;
	var rotating_point_x = -( hanging_point_x + (photo_border*2) );
	var rotating_point_y = -( hanging_point_y + (photo_border*2) );
	var rotating_point_x = hanging_point_x + photo_border;
	var rotating_point_y = hanging_point_y + photo_border;

	function spread_albums() {
		var required_width = nmb_albums*base_margin*2;
		var available_width = $('#fp_body-gallery').width();
		var extra_width = available_width - required_width;
		if( $('#fp_body-gallery').width() - required_width > required_width ) {
			var margin_width = base_margin;
			var images_width_px = extra_width / nmb_images;
		} else {
			var margin_width = Math.max( base_margin + (extra_width/(nmb_albums)), -(base_margin/2) );
			var images_width_px = 0;
		}
		$.previous_albums = 0;
		
		$('.sub-album').css({'marginLeft' : margin_width+'px', 'marginRight' : margin_width+'px'});
		//$('.sub-album').animate({'marginLeft' : margin_width+'px', 'marginRight' : margin_width+'px'},500);
		
		$albums.each(function(){
			var $album 	= $(this);
			//var current_album = $this.index();
			var total_pic 	= $album.find('.content').length;
			var album_width_px = images_width_px * total_pic + (margin_width*2);
			var album_width	= ( images_width_px > 0) ? album_width_px * 100 / available_width : 100 / nmb_albums ;

			var album_left = $.previous_albums;

			//$.albums_width[i] = album_width;//storing album width
			//$.albums_left[i] = album_left;//storing left offset
			//store the current album's left for the reverse operation
			$album.data('left',album_left);
			$album.data('width',album_width);
			
			$album.css('left', album_left +'%');
			$album.css('width',album_width+'%');

			$.previous_albums += album_width;
			//$this.stop().animate({'top':'36px'},500);

		
		
		var cnt_contents = 0;
		$album.find('.content').each(function(){
			var $content = $(this);				
			//var current_content = $(this).index();
			var total_pic 	= $content.siblings('.content').length;
			//window width
			var image_left 	= 100/(total_pic)*cnt_contents;
			++cnt_contents;
			$content.stop().animate({'left':image_left+'%'},100);
});
		
		
		}).unbind('click').bind('click',spreadPictures);
		//also rotate each picture of an album with a random number of degrees
	}

	//var album_spacing	= 100/(nmb_albums+1);
	//preload all the images (thumbs)
	$images.each(function(){
		var $image = $(this);
		$image.load(function(){
			$cadaimagen = $(this);
			++loaded;
			if(loaded == nmb_images){
				//let's spread the albums equally below the hooks
				spread_albums();
			}
			if( $cadaimagen.width() <= $cadaimagen.height() )
			$cadaimagen.parent().parent().addClass('vertical');

			var rotation = rotate_picture($cadaimagen);
			//imagenumber = $image.index();
			//$('#debug').html( $('#debug').html() + '<br/>' + imagenumber );

			$cadaimagen.parent().parent().transform({'rotate' : rotation + 'deg'});
			$image.data('rotame', rotation );
		});
	});
		
	
	
	function rotate_picture($imagen){
		
		if (gravity) {
			if( $imagen.width() > $imagen.height() ^ hanging_side == 'right' ) {
				var r	= Math.floor(Math.random()*angle_randomness) + Math.atan2( $imagen.width() - rotating_point_x , $imagen.height() - rotating_point_x ) * (-180/Math.PI) - (angle_randomness/2);
			} else {
				var r	= Math.floor(Math.random()*angle_randomness) + Math.atan2( $imagen.width() - rotating_point_y , $imagen.height() - rotating_point_y ) * (180/Math.PI) - (angle_randomness/2);
			}
		} else { var r = Math.floor(Math.random()*angle_randomness) + initial_angle - (angle_randomness/2) };
		return r;
	}
	
	
	function spreadPictures(){
		var $album 	= $(this);

		//track which album is opened
		album = $album.index();
		
		//hide all the other albums
		$albums
			.not($album).not('.aside')
				.stop()
				.addClass('aside')
				.each( function() {
					var width_px = $(this).parent().width;
					$(this).find('.sub-album').animate({'marginLeft' : base_margin+'px', 'marginRight' : base_margin+'px'},500);

					$(this)
						.addClass('aside moving')
						.animate({'top':'260px', 'left':$(this).data('left')+'%', 'width':$(this).data('width')+'%'},500, function() {
								$(this).removeClass('moving');
						})
						.unbind('click')
						.bind('click',spreadPictures)
				}).find('.content')
				.each(function(){
					$(this)
						.unbind('click')
						.unbind('mouseenter')
						.unbind('mouseleave')
		});

		$album.unbind('click');
		//now move the current album to the left 
		//and at the same time spread its images through the window
				
		$album.stop()
			.addClass('moving')
			.animate({'left':'0%', 'width':'100%', 'top':'0px' },500, function() {
			$(this).removeClass('aside moving')
			})
			.find('.descr').unbind('click');
		
		//$('#fp_back').html('Close '+ $album.find('.descr').html());
		//var albumname = $album.find('.descr').html();
		//$album.find('.descr').html( 'Close '+ albumname );
		$album.css('overflow','visible');
		//var total_pic 	= $album.find('.content').length;
		//var cnt			= 0;
		//each picture
		$album.find('.content')
			  .each(function(){
				$(this).unbind('click')
					   .bind('click',showImage)
					   .unbind('mouseenter')
					   .bind('mouseenter',upImage)
					   .unbind('mouseleave')
					   .bind('mouseleave',downImage);
		});
	}
	
	//displays an image (clicked thumb) in the center of the page
	//if nav is passed, then displays the next / previous one of the 
	//current album
	function showImage(nav){
		if(!enableshow) return;
		enableshow = false;
		if(nav == 1){
			//reached the first one
			if(current==0){
				enableshow = true;
				return;
			}
			var $content = $('#fp_thumbContainer div.album:nth-child('+parseInt(album+1)+')')
									  .find('.content:nth-child('+parseInt(current)+')');
			//reached the last one
			if($content.length==0){
				enableshow = true;
				current-=2;
				return;
			}	
		}
		else
			var $content = $(this);
		
		//show ajax loading image
		$loader.show();
		
		//there's a picture being displayed
		//lets slide the current one up
		if(current != -1){
			hideCurrentPicture();
		}
		
		current 				= $content.index();
		var $thumb				= $content.find('img');
		var imgL_source 	 	= $thumb.attr('rel');
		var imgL_title		 	= ($thumb.attr('title')) ? $thumb.attr('title') : '';
		$.imgL_description 	= $content.find('.fp_photo-caption').html();
		//preload the large image to show
		$('<img style=""/>').load(function(){
			var $imgL 	= $(this);
			//resize the image based on the windows size
			resize($imgL);
			//create an element to include the large image
			//and its description
			var $preview = $('<div />',{
				'id'		: 'fp_preview',
				'class'		: 'fp_preview',
				'html'     	: '<div class="fp_close_x"></div><div class="fp_descr"><p>'+imgL_title+'</p></div>',
				'style'		: 'visibility:hidden;'
			});
			
			$preview.prepend($imgL);
			$('#fp_gallery').prepend($preview);
			
			var largeW 				= $imgL.width()+20;
			var largeH 				= $imgL.height()+10+45;
			//change the properties of the wrapping div 
			//to fit the large image sizes
			$preview.css({
				'width'			:largeW+'px',
				'height'		:largeH+'px',
				'marginTop'		:-largeH/2-20+'px',
				'marginLeft'	:-largeW/2+'px',
				'visibility'	:'visible'
			});
			//show navigation
			showNavigation();
			
			//hide the ajax image loading
			$loader.hide();
			
			//hide old report
			$('#fp_report-content').fadeOut(400, function(){
				$(this).html($.imgL_description);
			});
			
			//slide up (also rotating) the large image
			var r = Math.floor(Math.random()*21)-10;
			if(ie)
				var param = {
					'top':'50%'
				};
			else
				var param = {
					'top':'50%',
					'rotate': r+'deg'
				};
			$preview.stop().animate(param,500,function(){
				enableshow = true;
			});
			
			//show new report
			$('#fp_report-content').fadeIn(400);

		}).error(function(){
			//error loading image. Maybe show a message : 'no preview available'?
		}).attr('src',imgL_source);	
	}
	
	//click next image
	$next.bind('click',function(){
		current+=2;
		showImage(1);
	});
	
	//click previous image
	$prev.bind('click',function(){
		showImage(1);
	});
	
	//slides up the current picture
	function hideCurrentPicture(){
		current = -1;
		var r 		= Math.floor(Math.random()*20)-10;
		if(ie)
			var param = {
				'top':'-150%'
			};
		else
			var param = {
				'top':'-150%',
				'rotate': r+'deg'
			};
		$('#fp_preview').stop()
						.animate(param,500,function(){
							$(this).remove();
						});
	}
	
	//shows the navigation buttons
	function showNavigation(){
		$('div.fp_close_x').bind('click',function(){
			hideCurrentPicture();
		});
		$next.stop().animate({'right':'0px'},100);
		$prev.stop().animate({'left':'0px'},100);
	}
	
	//hides the navigation buttons
	function hideNavigation(){
		$next.stop().animate({'right':'-40px'},300);
		$prev.stop().animate({'left':'-40px'},300);
	}
	
	function calculateDistance(elem, mouseX, mouseY) {
        return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offset().left+(elem.width()/2)), 2) + Math.pow(mouseY - (elem.offset().top+(elem.height()/2)), 2)));
    }
	
	//mouseenter event on each thumb
	function upImage(e){
		var $content 	= $(this);
		var $theimage = $content.find('img');
		mX = e.pageX;
		mY = e.pageY;
		var rotation = $theimage.data('rotame')*-1;
		var over_distance = calculateDistance( $theimage, mX, mY);
		$content.data('distance' , over_distance );
		if (typeof espera !== "undefined") { if (espera) {// clearTimeout(espera); espera = null;
			//$content.addClass('selected');
		}// else {
		if( ! $content.hasClass('selected') ) {
		$content
			.addClass('selected moving aside')
				.find('.thumb-frame')
				.stop()
				.animate({'rotate': rotation+'deg' },200, function() {
					$content.removeClass('moving');																		
				});
			}
		}
	}
	    
	//mouseleave event on each thumb
	function downImage(e){
		var $content = $(this);
		var $theimage = $content.find('img');
		
		mX = e.pageX;
		mY = e.pageY;
		$theimage = $content.find('img');
		var curr_distance = calculateDistance( $theimage, mX, mY);
		var prev_distance = $content.data('distance');
		if ( curr_distance >= prev_distance ) {
			if (typeof espera !== "undefined" && !$content.hasClass('selected') ) clearTimeout(espera);
			$content.removeClass('selected')
				.addClass('moving')
				.find('.thumb-frame')
					.stop()
					.animate({'rotate': '0deg'},200, function(){
							$(this).removeAttr('style');
							$content.removeClass('aside moving');
					});
		} else {
			$content.removeClass('selected')
			espera = setTimeout( function(){
				$content
					.addClass('moving')
					.find('.thumb-frame')
						.animate({'rotate': '0deg'},200, function(){
							$(this).removeAttr('style');
							$content.removeClass('aside moving selected');
						});
				$content.data('distance' , 1 );
			}
, 400);//end timeout
			} //$content.unbind('mouseleave').bind('mouseleave', downImage);
	}
	
	//resize function based on windows size
	function resize($image){
		var widthMargin		= 300
		var heightMargin 	= 200;
		
		var windowH      = $('fp_gallery-body').height()-heightMargin;
		var windowW      = $('fp_gallery-body').width()-widthMargin;
		var theImage     = new Image();
		theImage.src     = $image.attr("src");
		var imgwidth     = theImage.width;
		var imgheight    = theImage.height;

		if((imgwidth > windowW)||(imgheight > windowH)){
			if(imgwidth > imgheight){
				var newwidth = windowW;
				var ratio = imgwidth / windowW;
				var newheight = imgheight / ratio;
				theImage.height = newheight;
				theImage.width= newwidth;
				if(newheight>windowH){
					var newnewheight = windowH;
					var newratio = newheight/windowH;
					var newnewwidth =newwidth/newratio;
					theImage.width = newnewwidth;
					theImage.height= newnewheight;
				}
			}
			else{
				var newheight = windowH;
				var ratio = imgheight / windowH;
				var newwidth = imgwidth / ratio;
				theImage.height = newheight;
				theImage.width= newwidth;
				if(newwidth>windowW){
					var newnewwidth = windowW;
					var newratio = newwidth/windowW;
					var newnewheight =newheight/newratio;
					theImage.height = newnewheight;
					theImage.width= newnewwidth;
				}
			}
		}
		$image.css({'width':theImage.width+'px','height':theImage.height+'px'});
	}});