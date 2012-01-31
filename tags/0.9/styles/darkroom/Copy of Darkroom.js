(function($) {
  $(function() {
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
	$.previous_albums = 0;
	$.albums_width = {};
	$.albums_left = {};
	$.imgL_description ='';
	
	//Darkroom variables
	var base_margin = 100; //set margin for 4-album view. When more than 4 albums are displayed, the width will be prorated
	var rotating_point_x = -( hanging_point_x + (photo_border*2) );
	var rotating_point_y = -( hanging_point_y + (photo_border*2) );
	var rotating_point_x = hanging_point_x + photo_border;
	var rotating_point_y = hanging_point_y + photo_border;
	
	//
	$('#expand_gallery').click( function() {
		$gallery_parent = $('#fp_body-gallery').parent(); 
		$('#fp_body-gallery').removeClass('captive').prependTo('body');
		$('body').addClass('fb_darkroom');
		$('body *').not('#fp_body-gallery, #fp_body-gallery *').addClass('fb_hidden');
	});
	$('#collapse_gallery').click( function() {
		$('body *').not('#fp_body-gallery, #fp_body-gallery *').removeClass('fb_hidden');
		$('body').removeClass('fb_darkroom');
		$('#fp_body-gallery').addClass('captive').prependTo($gallery_parent);
	});
	
	//ensures rotation point
	//$('.sub-content').css({'width' : 'subcontent_width', 'height':'subcontent_height', hanging_side : '-' + hanging_point_x + 'px', 'top' : '-'+hanging_point_y + 'px'});
	// Reduces margin when more than 4 albums, but stays the same for less than 3.
	var margin_width = Math.min( (base_margin / (nmb_albums)*4), base_margin);
	$('.sub-album').css({'marginLeft' : margin_width+'px', 'marginRight' : margin_width+'px'});

	
	//var album_spacing	= 100/(nmb_albums+1);
	//preload all the images (thumbs)
	$images.each(function(){
		var $image = $(this);
		$image.load(function(){
			$cadaimagen = $(this);
			++loaded;
			if(loaded == nmb_images){
				//let's spread the albums equally below the hooks
				$albums.each(function(i){
					var $this 	= $(this);
					//var current_album = $this.index();
					var total_pic 	= $(this).find('.content').length;
					var available_width = ( $('#fp_thumbContainer').width()-(margin_width*(nmb_albums)) );
					var images_width_px = available_width / nmb_images;
					var album_width_px = images_width_px * total_pic + margin_width;
					var album_width	= album_width_px / $('#fp_thumbContainer').width() * 100;
					
					var album_left = $.previous_albums;

					//$.albums_width[i] = album_width;//storing album width
					//$.albums_left[i] = album_left;//storing left offset
					//store the current album's left for the reverse operation
					$this.data('left',album_left);
					$this.data('width',album_width);
					
					$this.css('left', album_left +'%');
					$this.css('width',album_width+'%');

					$.previous_albums += album_width;
					//$this.stop().animate({'top':'36px'},500);

				
				
				var cnt_contents = 0;
				$this.find('.content').each(function(){
					var $content = $(this);				
					var total_pic 	= $(this).siblings('.content').length;
					//window width
					var image_left 	= 100/(total_pic)*cnt_contents;
					++cnt_contents;
					$content.stop().animate({'left':image_left+'%'},500);
				});
				
				
				}).unbind('click').bind('click',spreadPictures);
				//also rotate each picture of an album with a random number of degrees
			}
			if( $cadaimagen.width() <= $cadaimagen.height() )
			$cadaimagen.parent().parent().addClass('vertical');

			var rotation = rotate_picture($cadaimagen);
			$cadaimagen.attr('src', $image.attr('src')).parent().parent().transform({'rotate' : rotation + 'deg'});
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

		$albums.not($album).stop()
		.addClass('aside')
		.each( function() {
			$(this).animate({'top':'260px', 'left':$(this).data('left')+'%', 'width':$(this).data('width')+'%'},300)
			.unbind('click')
			.bind('click',spreadPictures)
			.removeAttr('overflow')
		}).find('.content')
			  .each(function(){
				$(this).unbind('click')
					   .unbind('mouseenter')
					   .unbind('mouseleave')
		});

		$album.unbind('click');
		//now move the current album to the left 
		//and at the same time spread its images through 
		//the window, rotating them randomly. Also hide the description of the album
				
		$album.stop()
			.animate({'left':'0%', 'width':'100%', 'top':'0px' },500, function() {
			$(this).removeClass('aside')
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
			var $content 			= $('#fp_thumbContainer div.album:nth-child('+parseInt(album+1)+')')
									  .find('.content:nth-child('+parseInt(current)+')');
			//reached the last one
			if($content.length==0){
				enableshow = true;
				current-=2;
				return;
			}	
		}
		else
			var $content 			= $(this);
		
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
		var imgL_title		 	= $thumb.next().html();
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
				'html'     	: '<span class="fp_close_x"></span><div class="fp_descr"><span>'+imgL_title+'</span></div>',
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
			$('#fp_report-content').fadeOut();
			$('#fp_report-content').html($.imgL_description);
			
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
			$('#fp_report-content').fadeIn();

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
		$('span.fp_close_x').bind('click',function(){
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
	
	//mouseenter event on each thumb
	function upImage(){
		$(this).unbind('mouseleave');
		var $content = $(this);
		var half_width = $content.find('img').width()/2;
		var horiz_adjust = ( $content.find('.sub-content').hasClass('vertical') ^ hanging_side == 'right' ) ? -half_width : half_width ;
	
		if ($content.data('state') == 2) {
			$content.bind('mouseleave', 'downImage');

		} else {
			
			$content
				.data('state','1')
				.addClass('selected')
				.css('z-index', '60')
				.addClass('aside')
				.find('.sub-content')
				.animate({'marginLeft' : horiz_adjust+'px', 'rotate': '0deg'},200, function(){
					$content
					.data('state','0')
					.bind('mouseenter', 'upImage');
				});
		}
	}
	
	//mouseleave event on each thumb
	function downImage(){
		var $content 	= $(this);
		if ($content.data('state') ) {
			$content
				.unbind('mouseleave')
				.data('state','2');
		} else {

			var $laimagen = $content.find('img');
			$content.removeClass('selected');
			var rotation = rotate_picture($laimagen);
						
			$content.css('z-index','').
				find('.sub-content').stop().animate({
					'marginLeft' : '0px', 'rotate': rotation+'deg'},400, function(){
					$content.bind('mouseenter', 'upImage');
				$(this).parent().removeClass('aside')
			});
		}
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
	}
  });
})(jQuery);

