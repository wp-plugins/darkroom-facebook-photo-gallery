<?php

/*
Darkroom Options Panel
*/

// get facebook authorization token
$facebook = new FacebookAPI;

// authorize session
if(isset($_POST['activate-facebook'])) {
	$facebook->get_auth_session($_POST['activate-facebook']);
}

// remove the user
if(isset($_GET['deactivate-facebook']) && isset($facebook->sessions[$_GET['deactivate-facebook']])) {
	$facebook->remove_user($_GET['deactivate-facebook']);
} 

$this_page = $_SERVER['PHP_SELF'].'?page='.$_GET['page'];

// get styles
$styles = fb_get_styles();
if (!$styles) $styles = "darkroom";

// update options if form is submitted


//START CHANGES HERE
  //Adding a Fan Page
  if ( is_numeric($_POST['fb_fan_page_id']) ){
	$fan_page_id=$_POST['fb_fan_page_id'];
	// We're going to add the fan pages by replicating
       // one of the sessions that fotobook already uses
	// but replacing some of the details
	$session_option_val=get_option('fb_facebook_session');

	//copy the first session
	$head_session=$session_option_val[0];
	//change some of the values
	$head_session['uid'] =$fan_page_id;
	$head_session['fpid']=$fan_page_id;
	$head_session['name']="Fan Page ".$fan_page_id;
	unset($head_session['gid']);	

	//add this altered session to the end of the list
	array_push($session_option_val,$head_session); 

	//save
	update_option('fb_facebook_session',$session_option_val);
  }

  //Adding a Groups Photos
  if ( is_numeric($_POST['fb_group_id']) ){
	$group_id=$_POST['fb_group_id'];
	// We're going to add the group by replicating
       // one of the sessions that fotobook already uses
	// but replacing some of the details
	$session_option_val=get_option('fb_facebook_session');

	//copy the first session
	$head_session=$session_option_val[0];
	//change some of the values
	$head_session['gid'] =$group_id;
	$head_session['name']="Group ".$group_id;

	//add this altered session to the end of the list
	array_push($session_option_val,$head_session); 

	//save
	update_option('fb_facebook_session',$session_option_val);
  }
//END CHANGES HERE


if (isset($_POST['submit'])) {
	fb_options_update_albums_page($_POST['fb_albums_page']);	
	update_option('fb_number_rows', $_POST['fb_number_rows']);
	//if (file_exists(FB_PLUGIN_PATH . 'premium/style_editor.php') ) update_option('fb_style', $_POST['fb_style']);
	if($_POST['fb_number_cols'] != 0) {
		update_option('fb_number_cols', $_POST['fb_number_cols']);
	}
	if(is_numeric($_POST['fb_embedded_width'])) {
		update_option('fb_embedded_width', $_POST['fb_embedded_width']);
	}
	update_option('fb_thumb_size', $_POST['fb_thumb_size']);
	update_option('fb_albums_per_page', $_POST['fb_albums_per_page']);
	update_option('fb_hide_pages', isset($_POST['fb_hide_pages']) ? 1 : 0);
	
	//Darkroom options
	update_option('fb_photo_border', $_POST['fb_photo_border']);
	update_option('fb_hanging_side',  $_POST['fb_hanging_side']);
	update_option('fb_hanging_point_x',  $_POST['fb_hanging_point_x']);
	update_option('fb_hanging_point_y',  $_POST['fb_hanging_point_y']);
	update_option('fb_pin_grip_x', $_POST['fb_pin_grip_x']);
	update_option('fb_pin_grip_y', $_POST['fb_pin_grip_y']);
	update_option('fb_initial_angle', $_POST['fb_initial_angle']);
	update_option('fb_gravity', $_POST['fb_gravity']);
	update_option('fb_angle_randomness', $_POST['fb_angle_randomness']);
	update_option('fb_uselogo', $_POST['fb_uselogo']);
	update_option('fb_takeover_page', $_POST['fb_takeover_page']);
	update_option('fb_logo_image', $_POST['fb_logo_image']);


	if(isset($_POST['fb_album_cmts'])) {
		fb_options_toggle_comments(true);
		update_option('fb_album_cmts', 1);
	} else {
		fb_options_toggle_comments(false);
		update_option('fb_album_cmts', 0);
	}
	foreach($styles as $style) {
		$stylesheet = FB_PLUGIN_PATH.'styles/'.$style.'/style.css';
		if(is_writable($stylesheet) && file_exists(FB_PLUGIN_PATH.'premium/style_editor.php') ) {
			file_put_contents($stylesheet, $_POST[$style.'_stylesheet']);
		}		
	}
	$sidebar_stylesheet = FB_PLUGIN_PATH.'styles/sidebar-style.css';
	if(is_writable($sidebar_stylesheet) && file_exists(FB_PLUGIN_PATH.'premium/style_editor.php') ) {
		file_put_contents($sidebar_stylesheet, $_POST['sidebar_stylesheet']);
	}
}

// add a photo album page if there is none
if(get_option('fb_albums_page') == 0) {
	$page = array(
		'post_author'		=> 1,
		'post_content'	 =>'',
		'post_title'		 =>'Photos',
		'post_name'			=>'photos',
		'comment_status' =>1,
		'post_parent'		=>0
	);
	// add a photo album page 
	if(get_bloginfo('version') >= 2.1) {	
		$page['post_status'] = 'publish';
		$page['post_type']	 = 'page';
	} else {
		$page['post_status'] = 'static';
	}
	$page_id = wp_insert_post($page);
	update_option('fb_albums_page', $page_id);
}

// get options to fill in input fields
$fb_session         = get_option('fb_facebook_session');
$fb_albums_page     = get_option('fb_albums_page');
$fb_number_rows     = get_option('fb_number_rows');
$fb_number_cols     = get_option('fb_number_cols');
$fb_album_cmts      = get_option('fb_album_cmts');
$fb_thumb_size      = get_option('fb_thumb_size');
$fb_albums_per_page = get_option('fb_albums_per_page');
$fb_style           = get_option('fb_style');
$fb_embedded_width  = get_option('fb_embedded_width');
$fb_hide_pages      = get_option('fb_hide_pages');

//Darkroom options
$fb_photo_border	= get_option('fb_photo_border');
$fb_hanging_side	= get_option('fb_hanging_side');
$fb_hanging_point_x	= get_option('fb_hanging_point_x');
$fb_hanging_point_y	= get_option('fb_hanging_point_y');
$fb_pin_grip_x		= get_option('fb_pin_grip_x');
$fb_pin_grip_y		= get_option('fb_pin_grip_y');
$fb_initial_angle	= get_option('fb_initial_angle');
$fb_gravity			= get_option('fb_gravity');
$fb_angle_randomness =get_option('fb_angle_randomness');
$fb_uselogo 		= get_option('fb_uselogo');
$fb_takeover_page 		= get_option('fb_takeover_page');
$fb_logo_image 		= get_option('fb_logo_image');
$fb_linkhate 		= get_option('fb_linkhate');

?>

<?php if($facebook->msg): ?>
<div id="message" class="<?php echo $facebook->error ? 'error' : 'updated' ?> fade"><p><?php echo $facebook->msg ?></p></div>
<?php endif; ?>

<div class="wrap">
	<div id="fb-panel">
		<?php fb_info_box() ?>
		<h2 style="clear: none"><?php _e('Darkroom &rsaquo; Settings') ?> <span><a href="<?php echo FB_MANAGE_URL ?>">Manage Albums &raquo;</a></span></h2>
		<p>This plugin links to your Facebook account and imports all of your albums into a page on your blog. To get 
			started you need to give permission to the plugin to access your Facebook account and then import 
			your albums on the management page.</p>
			<h3>Facebook</h3>
			<p>To use this plugin, you must link it to your Facebook account.</p>
			<table class="accounts">
				<tr>
					<td valign="top" width="170">
						<h3>Add an Account</h3>
						<?php if($facebook->token): ?>
						<form method="post" id="apply-permissions" action="<?php echo FB_OPTIONS_URL ?>">
							<input type="hidden" name="activate-facebook" value="<?php echo $facebook->token ?>" />
							<p><a id="grant-permissions" href="http://www.facebook.com/login.php?api_key=<?php echo FB_API_KEY ?>&amp;v=1.0&amp;auth_token=<?php echo $facebook->token ?>&amp;popup=0&amp;skipcookie=1&amp;ext_perm=user_photos,offline_access,user_photo_video_tags" class="button-secondary" target="_blank">Step 1: Authenticate &gt;</a></p>
							<p><a id="request-permissions" href="http://www.facebook.com/connect/prompt_permission.php?api_key=<?php echo FB_API_KEY ?>&next=<?php echo urlencode('http://www.facebook.com/desktopapp.php?api_key='.FB_API_KEY.'&popup=1') ?>&cancel=http://www.facebook.com/connect/login_failure.html&display=popup&ext_perm=offline_access,user_photos,user_photo_video_tags" class="button-secondary" target="_blank">Step 2: Get Permissions &gt;</a></p>
							<p><input type="submit" class="button-secondary" value="Step 3: Apply Permissions &gt;" /></p>
						</form>
						<?php else: ?>
						Unable to get authorization token.
						<?php endif ?>
					</td>
					<td valign="top">
						<h3>Current Accounts</h3>
						<?php 
						if($facebook->link_active()): 
						foreach($facebook->sessions as $key=>$value): 
						?>
						<form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="get">
							<img src="http://www.facebook.com/favicon.ico" align="absmiddle">
			<?php //START CHANGES HERE
				if(is_numeric($facebook->sessions[$key]['gid'])){
					$link="http://www.facebook.com/group.php?gid=".$facebook->sessions[$key]['gid'];
				}else{
					$link="http://www.facebook.com/profile.php?id=".$facebook->sessions[$key]['uid'];
				}
			?>
			<a href="<?php echo $link; ?>" target="_blank"><?php echo $facebook->sessions[$key]['name']; ?></a>
				<?php //END CHANGES HERE ?>
				
							<input type="hidden" name="deactivate-facebook" value="<?php echo $key ?>">
							<input type="hidden" name="page" value="<?php echo $_GET['page'] ?>">
							<input type="submit" class="button-secondary" value="Remove" onclick="return confirm('Removing an account also removes all of the photos associated with the account.  Would you like to continue?')">
						</form>
						<?php endforeach; ?>
						<?php else: ?>
						<p>There are currently no active Facebook accounts.</p>
						<?php endif; ?>
						<?php if($facebook->link_active()): ?>
						<p><small>This plugin has been given access to data from your Facebook account.	You can revoke this access at any time by clicking remove above or by changing your <a href="http://www.facebook.com/privacy.php?view=platform&tab=ext" target="_blank">privacy</a> settings.</small></p>
						<?php endif; ?>
					</td>
				</tr>
			</table>
	
		<form method="post" action="<?php echo $this_page ?>&amp;updated=true">		
		
<?php //START CHANGES HERE ?>
		<h3><?php _e('Add A Fan Page') ?></h3>
	<table class="form-table">
	  <tr>
	    <th scope="row"><?php _e('Fan Page ID') ?></th>
           <td>
	    <input name="fb_fan_page_id" type="text" value="" size="20" />
	    <small><?php _e('A page id of a Fan Page whose albums you wish to be able to show. You must first add an account above. Fan page albums will appear in the User Accounts section above. ') ?></small>
	    </td>
	  </tr>
	</table>

	<table class="form-table">
		<h3><?php _e('Add A Facebook Group') ?></h3>
	  <tr>
	    <th scope="row"><?php _e('Group ID') ?></th>
           <td>
	    <input name="fb_group_id" type="text" value="" size="20" />
	    <small><?php _e('A group id of a group whose photos you wish to be able to show. You must first add an account above. Fan page albums will appear in the User Accounts section above. ') ?></small>
	    </td>
	  </tr>
        <tr>
            <th scope="row"><?php _e('Albums Page') ?></th>
            <td>
                <select name="fb_albums_page">
                    <?php if(!fb_albums_page_is_set()): ?>
                    <option value="0" selected>Please select...</option>
                    <?php endif; ?>
                    <?php fb_parent_dropdown($fb_albums_page); ?>
                </select><br />
                <small>Select the page you want to use to display the photo albums.</small>
            </td>
        </tr>
	</table>
<?php //END CHANGES HERE ?>

        <h3><?php _e('Darkroom Options') ?></h3>
        <p>Leave these options unchanged to keep the Darkroom design</p>
        <table class="form-table">
            <tr>
                <th scope="row"><?php _e('Photo Border') ?></th>
                <td>
                    <input name="fb_photo_border" type="text" value="<?php echo $fb_photo_border; ?>" size="1" />px&nbsp;
                    <small><?php _e('The width of border for thumbnails. Use 0 for none') ?></small>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php _e('Hanging side') ?></th>
                <td>
                    <select name="fb_hanging_side">
        <?php $selected = ($fb_hanging_side == 'left') ? ' selected' : null; ?>
                        <option value="left"<?php if ($fb_hanging_side == 'left') echo ' selected'; ?>>left</option>
                        <option value="right"<?php if ($fb_hanging_side == 'right') echo ' selected'; ?>>right</option>
                    </select>
                    <small><?php _e('Corner the photos will hang from (left - right)') ?></small>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php _e('Thumbnail Hanging point') ?></th>
                <td>
                    x:<input name="fb_hanging_point_x" type="text" value="<?php echo $fb_hanging_point_x; ?>" size="2" />&nbsp;&nbsp;
                    y:<input name="fb_hanging_point_y" type="text" value="<?php echo $fb_hanging_point_y; ?>" size="2" />&nbsp;&nbsp;
                    <small><?php _e('Coordinates of the point the thumbnail hangs from (from hanging side above)') ?></small>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php _e('Pin grip point') ?></th>
                <td>
                    x:<input name="fb_pin_grip_x" type="text" value="<?php echo $fb_pin_grip_x; ?>" size="2" />&nbsp;&nbsp;
                    y:<input name="fb_pin_grip_y" type="text" value="<?php echo $fb_pin_grip_y; ?>" size="2" />&nbsp;&nbsp;
                    <small><?php _e('Coordinates of the grip point in pin image (which the photo hangs from)') ?></small>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php _e('Gravity') ?></th>
                <td>
                    <label><input name="fb_gravity" type="checkbox" value="true" <?php if($fb_gravity) echo ' checked'; ?> />
                    <small><?php _e('Ignores angle above and rotates each photo by its weight (longer images will hang straighter).') ?></small></label>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php _e('Fixed Angle') ?></th>
                <td>
                    <input name="fb_initial_angle" type="text" value="<?php echo $fb_initial_angle; ?>" size="2" />
                    <small><?php _e('Initial angle of photo if &quot;Gravity&quot; is not checked') ?></small>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php _e('Angle Randomness') ?></th>
                <td>
                    <input name="fb_angle_randomness" type="text" value="<?php echo $fb_angle_randomness; ?>" size="2" />
                    <small><?php _e('Maximum photo angle jitter (degrees)') ?></small>
                </td>
            </tr>
            <tr>
                <th scope="row"><?php _e('Block link-back') ?></th>
                <td>
                    <label><input name="fb_linkhate" type="checkbox" value="1" <?php if($fb_linkhate) echo 'checked'; ?> />
                    <small><?php _e('Check if a link back my site hurts you deeply') ?></small></label>
                </td>
            </tr>
            </table>
		<h3><?php _e('Full-width options') ?></h3>
	<table class="form-table">
        <p style="font-weight: bold;">
                <tr>
					<th scope="row"><?php _e('Show logo') ?></th>
					<td>
						<label><input name="fb_uselogo" type="checkbox" value="true" <?php if($fb_uselogo) echo ' checked'; ?> />
<small><?php _e(' Upload it below for Premium package or replace my_logo.png file'); ?></small></label>
					</td>
                </tr>
			<?php if( is_dir(FB_PLUGIN_PATH . 'premium') ) include( FB_PLUGIN_PATH . 'premium/option_fields.php' ); ?>	
            </table>
<?php //END darkroom settings ?>

			<h3><?php _e('Original Darkroom options') ?></h3>
			<table class="form-table">

				<tr>
					<th scope="row"><?php _e('Embedded Width') ?></th>
					<td>
						<input name="fb_embedded_width" type="text" value="<?php echo $fb_embedded_width; ?>" size="3" />px
						<small><?php _e('Restrain the width of the embedded photo if it is too wide for your theme.	Set to \'0\' to display the full size.') ?></small>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php _e('Max Thumbnail Size') ?></th>
					<td>
						<input name="fb_thumb_size" type="text" value="<?php echo $fb_thumb_size; ?>" size="3" />px
						<small><?php _e('The maximum size of the thumbnail. The default is 130px.') ?></small>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php _e('Cron URL') ?></th>
					<td>To setup automatic updates of your albums, create a cron job that regularly loads the following URL.	If you are unsure how to setup a cron job, <a href="http://www.google.com/search?q=cron">Google</a> is your friend.<br /> <small><?php echo fb_cron_url() ?></small></td>
				</tr>
			</table>
			<?php if( is_dir(FB_PLUGIN_PATH . 'premium') ) include( FB_PLUGIN_PATH . 'premium/style_editor.php' ); ?>	
			<p class="submit">
				<input type="submit" name="submit" value="<?php _e('Update Options') ?> &raquo;" />
			</p>
		</form>
	</div>
</div> 
