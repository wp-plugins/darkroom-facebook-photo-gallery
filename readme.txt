=== Darkroom Facebook Photo Gallery ===
Contributors: SocialBlogsite, Sergio Zambrano
Donate link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=EHE67MABZCGV2
Tags: facebook, photos, images, gallery, fotobook, import, widget, media, darkroom, developing, line, pin
Requires at least: 2.6
Tested up to: 3.3.1
Stable tag: 1.6

The first Facebook Photo Album -to- jQuery-animated gallery for WordPress. Customizable in design and functionality.

== Description ==

[Live Demo](http://socialblogsitewebdesign.com/portfolio)
Why uploading your photos to both facebook and Wordpress? With this plugin you can keep them where your friends are already liking them, and displaying them in your website with the best interface neither facebook or WordPress offer.
Facebook Darkroom Photo Gallery is a fully animated jQuery photo gallery, inially styled as a darkroom photo drying line, with clothe pins and gravity-hung photos.
Each photo features title, SEO keywords and description, as well as album titles and cool effects!
Upload them from your mobile to Facbook as usual, and they will show in your WordPress (automated update using cron script).

See features below for a description of the level of customization that enables you to change this "Darkroom" concept/style into your own.
This plugin is based on the Fotobook plugin by Aaron Harp and Chris Wright, and was possible thanks to the jQuery tutorial by Manoela Ilic.
   
= Darkroom Features: =

* Option to hang the photos from different corners
* Option to rotate the photos a fixed amount or using its gravity
* Option to add random rotation to the photos
* Option to change the color of overlay, hanging the photos from different corners, using your own clips, pins, or other image and adjust the point of grip, as well as the center of rotation/hanging-point of the photos, using their own gravity or a fixed rotation, and more.

= Future features =

*Better Internet Explorer compatibility (current version works better in modern browsers, e.g. Chrome, Firefox, Safari)

= Options for sale =

* Fullscreen option (takes over the browser&rsquo;s window making the effect cooler and animations smoother.
* In-dashboard css, background, and pin photo editors so you can make your own theme with hanging photos!

= Fotobook Features (from Fotobook Plugin) =

* Interfaces with Facebook's API
* Displays photo albums on a WordPress page
* Import photos from mulitple Facebook accounts
* Sidebar widgets for displaying random or recent photos & albums
* Creates an album of photos that the user's tagged in
* Insert individual photos into posts/pages
* Easy-to-use Ajax album management panel
* Frontend validates as XHTML 1.0 Strict

![SocialBlogsiteWebDesign.com](http://socialblogsitewebdesign.com/wordpress_plugins/darkroom-facebook-photo-gallery)

== Installation ==

This installation is for any other than the easy "install" button at your Dashboard/Plugins/Add New/Search page, of course.

1. Download and unzip
2. Upload the entire darkroom-facebook-photo-gallery folder to /your-wordpress-install-dir/wp-content/plugins/
3. Login to your WP Admin panel, click Plugins, and activate the plugin.
4. Click "Darkroom" under your Dashboard settings menu or "Settings" action link in the Plugins list and follow the two steps for linking the plugin to a Facebook account.
5. Click "Manage Albums" - link at the top - and import/organize your albums. You can drag-drop to sort them out, hide and show them.
6. Upload your logo (or choose not to use it) and other options in the "Darkroom" Dashboard's settings page

It works better in fluid layouts. If you can, just copy your page's template and make it fluid to use it with the gallery's page only. The more width is available the less-crowded the photos will appear when the albums gets expanded.

To take enhance SEO and photo tagging, make sure you separate your Facebook photo captions into three parts, with an empty line between them (two carriage returns) as follow:

* **1st. line:** Photo title: Used for enlarged photo's caption and in thumbnail's alt attribute. Keep it as short as the photo's width.
* **2nd. line:** SEO tags: Used in the title attribute (the one revealed when the thumbnail is hovered).
* **Rest of text:** Photo description: Displayed at the top right when a photo is clicked.

== Screenshots ==

1. Here's the Darkroom style, but you could change it into a new concept by using different pins, clips, and styling.
2. This new style was the original idea achieved for a [famous Daylight Swordfishing Charter](http://www.floridakeysswordfishing.com) - soon online

== Changelog ==

= 1.6 = 
Fixed jQuery issues with jQuery versions used by other plugins which made albums not benign distributed some times. Fixed logo disappearing some themes. Fixed some CSS3 issues when hanging photos from right side.

= 1.5 = 
Speed improved and temporary position of photos where hard-coded to prevent photos not distributing correctly along the line when they are not loaded fast enough!

= 1.4 = 
Optimized for speed

= 1.3 = 
Some workarounds for cheap hosting messing with options page not loading
Logo links to Facebook albums

= 1.2 = 
Same than 1.1, but uploaded it to the right place. I happened to upload the whole tags and trunk directories inside trunk, just because this time wordpress sent me the confirmation email with the url of my plugin including /trunk. So Everithing was inside trunk. Nice. he ones who downloaded it probably noticed it. My apologies to the others. I wonder how even WP server saw it as a working download-able version! (It even shown the correct version :S )

= 1.1 =
Attempt to fix "The plugin does not have a valid header." error when attempting easy install

= 1.0 =
Fixed some spelling (more to be found! English is not my first language, sorry)
Missing wp-upload-media scripts which fixes "upload logo" button.

= 0.9 =
Release