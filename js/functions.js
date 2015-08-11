var $window = $(window), 
  win_height_padded = $window.height() * 0.8,
  isTouch = Modernizr.touch;


function getJson(source){
	var i = -1;
  var items = [];
  var item0 = {title:"TRENDING",subtitle:"Six Senses Hotels Resorts Spas are discovered in some of the world's most unique and beautiful places"};
  var item1 = {title:"LIVE FEED",subtitle:"Six Senses Hotels Resorts Spas are discovered in some of the world's most unique and beautiful places"};
  items.push(item1);
  items.push(item0);
  var highlight = [];
  var posts = [];


  initialUrl = "https://api.tintup.com/v1/feed/feed-page?api_token=3c9aa7e3281cccf47ca65fc005dc89c9c2651c1e" + '&count=101';
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
          }
      	}else{
          $("#posts").html("");
        }

        var container ="<div class='packery clearfix'><div class='gutter-sizer'></div><div class='grid-sizer'></div>";
        var group =container;
        var feed = "";
        //create highlight
        group = group + createItemDiv(i) + createFirstImageText(items)+"</div>";
        for(var j=0;j<highlight.length;j++){
          i++;
          if(j<=3){
            group = group + createContainer(highlight[j],i);
          }else{
            break;
          }
        }
        feed = group+"</div>"+ "<div class='spacer'></div>";
        group = container; 
        i=-1;
        group = group + createItemDiv(i) + createFirstImageText(items)+"</div>";
        //create posts
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
        feed = feed+group+"</div>";
        $("#posts").html(feed);
	});
  
  setTimeout(function(){packery()},4000);
  setTimeout(function(){revealOnScroll()},4000);
}

function createContainer(val,i){
  var url= "'"+val.url+"'";
	var container ="<div class='item item-w"+i+" revealOnScroll cursor' data-animation='zoomIn' data-timeout='100' onclick='window.open(&quot;"+val.url+"&quot;,&quot;_blank&quot;)'>"
  var img = "<img src='"+val.original_image+"' />";
	var source = "<div class='feed-source feed-source-"+val.source+"'></div>";
	var text = "<div class='post-title-color color-namebar-buttons'><div class='text-container'><p><span>"+val.comments+"</span></p><div class='sm-icons'><div class='follow'><a target='_blank' href='http://www.facebook.com/sharer.php?u="+val.url+"'><i class='fa fa-facebook fa-lg'></i></a><a target='_blank' href='http://twitter.com/share?url="+val.comments+"%20"+val.url+"'><i class='fa fa-twitter fa-lg'></i></a><a href='mailto:?subject=I sent this email from Six Senses feed.&amp;body=Check out this post "+val.url+"'><i class='fa fa-envelope fa-lg'></i></a></div></div></div></div>";
  return container + img+ source + text + "</div>";
}
function createFirstImageText(items){
  itemObj = items.pop();
  banner = "<div class='feed-first-text'><div class='feed-title'>"+itemObj.title+"</div><p>"+itemObj.subtitle+"</p></div>";
  return banner;
}
function createBanner(){
	banner= "<div class='ugc-cta' style='opacity: 1;'><div class='small-text'>Share your </div>		<div class='brand-name'>#OUTOFTHEORDINARY</div>	<div class='sm-icons'><div class='follow'><a href='https://www.facebook.com/'><i class='fa fa-facebook fa-lg'></i></a><a href='https://twiter.com/'><i class='fa fa-twitter fa-lg'></i></a><a href='https://www.pinterest.com/'><i class='fa fa-pinterest-p fa-lg'></i></a><a href='https://instagram.com/'><i class='fa fa-instagram fa-lg'></i></a></div></div>	</div>"
	return banner ;
}
function createItemDiv(i){
  return "<div class='item item-w"+i+" revealOnScroll' data-animation='zoomIn' data-timeout='100'>";
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
  var gutter = pckry.options.gutter || 0;
  var columnWidth = pckry.options.columnWidth + gutter;

  function onResize() {
    var outsideSize = getSize( $container.parent()[0] ).innerWidth;
    var cols = Math.floor( outsideSize / ( columnWidth ) );
    // set container width to columns
    $container.width( cols * columnWidth - gutter )
    // manually trigger layout
    $container.packery();
    // run imagefill inside the resize event
    $(".item img").imagefill();
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