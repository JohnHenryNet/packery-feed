var $window = $(window), 
  win_height_padded = $window.height() * 0.8;

function search(value){
  if(value == ""){
    getJson("");
  }else{
    var highlight = [];
    var posts = [];

    $.ajax({
          type: 'GET',
          dataType: 'jsonp',
          data: {},
          url: "http://www.tintup.com/api/posts/feed-page?query="+value+"&moderation=0&user_id=123933144&moderation=1&api_token=3c9aa7e3281cccf47ca65fc005dc89c9c2651c1e&callback=?",
          error: function (jqXHR, textStatus, errorThrown) {
              console.log(jqXHR)
          },
          success: function (data) {
            console.debug(url);
            if(data != null && data.length>0){
                $.each( data, function( key, val ) {
                  if (val.highlight == "true") {
                    highlight.push(val);
                  }else{
                    posts.push(val);
                  }
                });
                $("#posts").html("");
                showHighlight(highlight);
                showPosts(posts);
            }else{
              $("#posts").html("<h3 class='tc ac'>There are no posts here to view yet.</h3>");
            }
          }
      });
  }
}
var container ="<div class='packery clearfix'><div class='gutter-sizer'></div><div class='grid-sizer'></div>";
var link;
function getJson(source){
  var highlight = [];
  var posts = [];

  initialUrl = "https://api.tintup.com/v1/feed/feed-page?api_token=3c9aa7e3281cccf47ca65fc005dc89c9c2651c1e" + '&count=193';
  callback = '&callback=?'
  url = (source != "undefined" || source!="")?initialUrl+"&source="+source+callback:initialUrl+callback;
	$.getJSON( url, function( data ) {
        if(data != null && data.data.length>0){
          if(data.data.length > 0){
            $.each( data.data, function( key, val ) {
              if (val.highlight == "true") {
                highlight.push(val);
              }else{
                posts.push(val);
              }
            });
            $("#posts").html("");
            showHighlight(highlight);
            showPosts(posts);
            link = data.next_page;
          }
        }else{
          $("#posts").html("<h3 class='tc ac'>There are no posts here to view yet.</h3>");
        }
	});
}

function showHighlight(highlight){
    var i = -1;
    var items = [];
    var title="TRENDING";
    var subtitle="Some favorite #outoftheordinary experiences at Six Senses resorts and spas.";

    var group =container;
    var feed = "";
    //create highlight
    if(highlight.length > 0){
      group = group + createItemDiv(i) + createFirstImageText(title, subtitle)+"</div>";
      for(var j=0;j<highlight.length;j++){
        i++;
        if(j<=3){
          group = group + createContainer(highlight[j],i);
        }else{
          break;
        }
      }
      feed = group+"</div>"+ "<div class='spacer'></div>";
    }
    $("#posts").append(feed);
}
function showPosts(posts){
  //create posts
  var title="LIVE FEED";
  var subtitle="Join our live feed to share your #outoftheordinary moments.";
  var feed = "";
  var group = container; 
  i=-1;
  if(posts.length > 0){
    group = group + createItemDiv(i) + createFirstImageText(title,subtitle)+"</div>";
    i++;
    for(var j=0;j<posts.length;j++){
      if(i==4 || i==10){
        group = group + createItemDiv(i)+ createBanner()+"</div>"
        i++;
      }
      if (i == 15){
        group = group;
        i=0;
      }else{
        group = group + createContainer(posts[j],i);
        i++;
      }
    }
    
  }
  feed = feed+group+"</div>";
  $("#posts").append(feed);
  packery();
  revealOnScroll();
}

function showMorePosts(posts){
  //create posts
  var feed = "";
  i=-1;
  var group = container;
  var j=0;
  if(posts.length > 0){
    group = group + createContainer(posts[j],i);
    j=1;
    while(j<posts.length){
      if(i==4 || i==10){
        group = group + createItemDiv(i)+ createBanner()+"</div>"
        i++;
      }
      if (i == 15){
        group = group;
        i=0;
      }else{
        group = group + createContainer(posts[j],i);
        i++;
      }
      j++;
    }
  }

  feed = feed+group;
  $("#posts").append(feed);
  packery();
  revealOnScroll();
}
var processing;

function morePosts(){
  if (processing)
    return false;

  console.debug(link);
  url = link +'&callback=?';
  processing = true; 
  $.getJSON( url, function( data ) {
        if(data != null && data.data.length>0){
          if(data.data.length > 0){
            posts=data.data;
            showPosts(posts, false);
            link = data.next_page;
            processing = false;
          }
        }
  });
}
function createContainer(val,i){
	var shareText = "Share%20your%20most%20amazing%20and%20memorable%20%23outoftheordinary%20experiences%20at%20Six%20Senses%20resorts%20and%20spas%2E%20theedit%2Esixsenses%2Ecom";
	var fb_share = "https://www.facebook.com/dialog/feed?app_id=412668832250655&display=popup&caption="+shareText+"&link="+val.url+"&redirect_uri=http://theedit.sixsenses.com/&name=THEEDIT%2ESIXSENSES%2ECOM";
	var tw_share="http://twitter.com/share?url="+val.url+"&text="+shareText;
	var container ="<div class='item item-w"+i+" revealOnScroll cursor' data-animation='flipInX' data-timeout='100' onclick='window.open(&quot;"+val.url+"&quot;,&quot;_blank&quot;)'>"
	var img = "<img src='"+val.original_image+"' />";
	var source = "<div class='feed-source feed-source-"+val.source+"'></div>";
	var text = "<div class='post-title-color color-namebar-buttons'><div class='text-container'><p class='time-text'>"+calculateTimeAgo(val.created)+"</p><p class='post-comments'>"+clapText(i,val.comments)+"</p><div class='sm-icons'><div class='follow'><a href='"+fb_share+"' target='_blank' title='Share on Facebook' onclick='openPopUp(this);'><i class='fa fa-facebook fa-lg'></i></a><a href='"+tw_share+"' target='_blank' title='Share on Twitter' onclick='openPopUp(this);'><i class='fa fa-twitter fa-lg'></i></a><a onclick='window.open(&quot;mailto:?subject="+shareText+".&amp;body=Check out this post "+val.url+"&quot;,&quot;_blank&quot;);return false;'><i class='fa fa-envelope fa-lg'></i></a></div></div>";
  var cta = ""
  if (val.cta != ""){
    ctaObject = JSON.parse(val.cta);
    cta = "<div class='cta'><div class='sm-icons'><div class='follow'><span onclick='window.open(&quot;"+ctaObject.url+"&quot;,&quot;_blank&quot;)'>"+ctaObject.text+"</span></div></div></div></div></div>";
  }else{
    cta="</div></div>"
  }
  return container + img+ source + text + cta + "</div>";
}
function clapText(i,text){
	return ((i == 0 || i== 6 || i==9)?text.substring(0,120):text.substring(0,54))+"...";
}
function openPopUp(element){
  var redirectWindow = window.open(element.href, '_blank' ,'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
  redirectWindow.location;
}
function createFirstImageText(title,subtitle){
  banner = "<div class='feed-first-text'><div class='feed-title'>"+title+"</div><p>"+subtitle+"</p></div>";
  return banner;
}
function createBanner(){
	banner= "<div class='ugc-cta' style='opacity: 1;'><div class='small-text'>Share your </div>		<div class='brand-name'>#OUTOFTHEORDINARY</div>	<div class='small-text'>on </div>   <div class='sm-icons'><div class='follow-banner unclick'><a target='_blank' href='https://www.facebook.com/SixSenses'><i class='fa fa-facebook fa-lg'></i></a><a target='_blank' href='https://twitter.com/six_senses_'><i class='fa fa-twitter fa-lg'></i></a><a target='_blank' href='https://www.pinterest.com/sixsenseshotels/'><i class='fa fa-pinterest-p fa-lg'></i></a><a target='_blank' href='https://instagram.com/sixsenseshotelsresortsspas/'><i class='fa fa-instagram fa-lg'></i></a><a target='_blank' href='https://www.youtube.com/c/sixsenseshotelsresortsspas'><i class='fa fa-youtube fa-lg'></i></a></div></div>	</div>"
	return banner ;
}
function createItemDiv(i){
  return "<div class='item item-w"+i+" revealOnScroll' data-animation='flipInX' data-timeout='100'>";
}
function calculateTimeAgo(time){
  current = new Date();
  previous = new Date(time*1000);
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if(elapsed < 0){
    elapsed = current - new Date(time*100);
  }

  if (elapsed < msPerMinute) {
       return "about "+ Math.round(elapsed/1000) + ' seconds ago';   
  }

  else if (elapsed < msPerHour) {
       return "about "+ Math.round(elapsed/msPerMinute) + ' minutes ago';   
  }

  else if (elapsed < msPerDay ) {
       return "about "+ Math.round(elapsed/msPerHour ) + ' hours ago';   
  }

  else if (elapsed < msPerMonth) {
      return "about "+ Math.round(elapsed/msPerDay) + ' days ago';   
  }

  else if (elapsed < msPerYear) {
      return "about "+ Math.round(elapsed/msPerMonth) + ' months ago';   
  }

  else {
      return "about "+ Math.round(elapsed/msPerYear ) + ' years ago';   
  }
}
function revealOnScroll() {
  var scrolled = $window.scrollTop();
  $(".revealOnScroll:not(.animated)").each(function () {
    var $this     = $(this),
        offsetTop = $this.offset().top;

    if (scrolled + win_height_padded > offsetTop) {
      if ($this.data('timeout')) {
        $this.css("opacity","1",'important');
        window.setTimeout(function(){
         $this.addClass('animated ' + $this.data('animation'));
       }, parseInt($this.data('timeout'),10));
     } else {
       $this.addClass('animated ' + $this.data('animation'));
     }
   }
 });
}
function packery(){
  var $container = $('.packery').packery({
    itemSelector: '.item',
    columnWidth: 0,
    gutter: 4,
    isResizeBound: false
  });

  var pckry = $container.data('packery');
  var gutter = pckry.options.gutter || 4;
  var columnWidth = pckry.options.columnWidth + gutter;

  function onResize() {
    //var outsideSize = getSize( $container.parent()[0] ).innerWidth;
   // var cols = Math.floor( outsideSize / ( columnWidth ) );
    // set container width to columns
    //$container.width( cols * columnWidth - gutter )
    // manually trigger layout
    $container.imagesLoaded( function() {
      $container.packery();
      // run imagefill inside the resize event
      $(".item img").imagefill();
    });
  }

  // debounce resize event
  var resizeTimeout;
  $( window ).on( 'resize', function() {
    if ( resizeTimeout ) {
      clearTimeout( resizeTimeout );
    }
    resizeTimeout = setTimeout( onResize, 100 );
  })
  // initial trigger 
  onResize();
}