// core
( function( window, factory ) {
  // universal module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
        window,
        require('ev-emitter'),
        require('fizzy-ui-utils'),
    );
  } else {
    // browser global
    window.InfiniteScroll = factory(
        window,
        window.EvEmitter,
        window.fizzyUIUtils,
    );
  }
}( window, function factory( window, EvEmitter, utils ) {
  let jQuery = window.jQuery;
  // internal store of all InfiniteScroll intances
  const instances = {};

  function InfiniteScroll( element, options ) {
    const queryElem = utils.getQueryElement( element );

    if ( !queryElem ) {
      console.error( 'Bad element for InfiniteScroll: ' + ( queryElem || element ) );
      return;
    }
    element = queryElem;
    // do not initialize twice on same element
    if ( element.infiniteScrollGUID ) {
      const instance = instances[element.infiniteScrollGUID];
      instance.option( options );
      return instance;
    }

    this.element = element;
    // options
    this.options = {...InfiniteScroll.defaults};
    this.option( options );
    // add jQuery
    if ( jQuery ) {
      this.$element = jQuery( this.element );
    }

    this.create();
  }

  // defaults
  InfiniteScroll.defaults = {
  // path: null,
  // hideNav: null,
  // debug: false,
  };

  // create & destroy methods
  InfiniteScroll.create = {};
  InfiniteScroll.destroy = {};

  const proto = InfiniteScroll.prototype;
  // inherit EvEmitter
  Object.assign( proto, EvEmitter.prototype );

  // --------------------------  -------------------------- //

  // globally unique identifiers
  let GUID = 0;

  proto.create = function() {
  // create core
  // add id for InfiniteScroll.data
    const id = this.guid = ++GUID;
    this.element.infiniteScrollGUID = id; // expando
    instances[id] = this; // associate via id
    // properties
    this.pageIndex = 1; // default to first page
    this.loadCount = 0;
    this.updateGetPath();
    // bail if getPath not set, or returns falsey #776
    const hasPath = this.getPath && this.getPath();
    if ( !hasPath ) {
      console.error('Disabling InfiniteScroll');
      return;
    }
    this.updateGetAbsolutePath();
    this.log( 'initialized', [this.element.className] );
    this.callOnInit();
    // create features
    for ( const method in InfiniteScroll.create ) {
      InfiniteScroll.create[method].call( this );
    }
  };

  proto.option = function( opts ) {
    Object.assign( this.options, opts );
  };

  // call onInit option, used for binding events on init
  proto.callOnInit = function() {
    const onInit = this.options.onInit;
    if ( onInit ) {
      onInit.call( this, this );
    }
  };

  // ----- events ----- //

  proto.dispatchEvent = function( type, event, args ) {
    this.log( type, args );
    const emitArgs = event ? [event].concat( args ) : args;
    this.emitEvent( type, emitArgs );
    // trigger jQuery event
    if ( !jQuery || !this.$element ) {
      return;
    }
    // namespace jQuery event
    type += '.infiniteScroll';
    let $event = type;
    if ( event ) {
    // create jQuery event
    /* eslint-disable-next-line new-cap */
      const jQEvent = jQuery.Event( event );
      jQEvent.type = type;
      $event = jQEvent;
    }
    this.$element.trigger( $event, args );
  };

  const loggers = {
    initialized: ( className ) => `on ${className}`,
    request: ( path ) => `URL: ${path}`,
    load: ( response, path ) => `${response.title || ''}. URL: ${path}`,
    error: ( error, path ) => `${error}. URL: ${path}`,
    append: ( response, path, items ) => `${items.length} items. URL: ${path}`,
    last: ( response, path ) => `URL: ${path}`,
    history: ( title, path ) => `URL: ${path}`,
    pageIndex: function( index, origin ) {
      return `current page determined to be: ${index} from ${origin}`;
    },
  };

  // log events
  proto.log = function( type, args ) {
    if ( !this.options.debug ) return;

    let message = `[InfiniteScroll] ${type}`;
    const logger = loggers[type];
    if ( logger ) message += '. ' + logger.apply( this, args );
    console.log( message );
  };

  // -------------------------- methods used amoung features -------------------------- //

  proto.updateMeasurements = function() {
    this.windowHeight = window.innerHeight;
    const rect = this.element.getBoundingClientRect();
    this.top = rect.top + window.scrollY;
  };

  proto.updateScroller = function() {
    const elementScroll = this.options.elementScroll;
    if ( !elementScroll ) {
    // default, use window
      this.scroller = window;
      return;
    }
    // if true, set to element, otherwise use option
    this.scroller = elementScroll === true ? this.element :
    utils.getQueryElement( elementScroll );
    if ( !this.scroller ) {
      throw new Error(`Unable to find elementScroll: ${elementScroll}`);
    }
  };

  // -------------------------- page path -------------------------- //

  proto.updateGetPath = function() {
    const optPath = this.options.path;
    if ( !optPath ) {
      console.error(`InfiniteScroll path option required. Set as: ${optPath}`);
      return;
    }
    // function
    const type = typeof optPath;
    if ( type == 'function' ) {
      this.getPath = optPath;
      return;
    }
    // template string: '/pages/{{#}}.html'
    const templateMatch = type == 'string' && optPath.match('{{#}}');
    if ( templateMatch ) {
      this.updateGetPathTemplate( optPath );
      return;
    }
    // selector: '.next-page-selector'
    this.updateGetPathSelector( optPath );
  };

  proto.updateGetPathTemplate = function( optPath ) {
  // set getPath with template string
    this.getPath = () => {
      const nextIndex = this.pageIndex + 1;
      return optPath.replace( '{{#}}', nextIndex );
    };
    // get pageIndex from location
    // convert path option into regex to look for pattern in location
    // escape query (?) in url, allows for parsing GET parameters
    const regexString = optPath
        .replace( /(\\\?|\?)/, '\\?' )
        .replace( '{{#}}', '(\\d\\d?\\d?)' );
    const templateRe = new RegExp( regexString );
    const match = location.href.match( templateRe );

    if ( match ) {
      this.pageIndex = parseInt( match[1], 10 );
      this.log( 'pageIndex', [this.pageIndex, 'template string'] );
    }
  };

  const pathRegexes = [
  // WordPress & Tumblr - example.com/page/2
  // Jekyll - example.com/page2
    /^(.*?\/?page\/?)(\d\d?\d?)(.*?$)/,
    // Drupal - example.com/?page=1
    /^(.*?\/?\?page=)(\d\d?\d?)(.*?$)/,
    // catch all, last occurence of a number
    /(.*?)(\d\d?\d?)(?!.*\d)(.*?$)/,
  ];

  // try matching href to pathRegexes patterns
  const getPathParts = InfiniteScroll.getPathParts = function( href ) {
    if ( !href ) return;
    for ( const regex of pathRegexes ) {
      const match = href.match( regex );
      if ( match ) {
        const [, begin, index, end] = match;
        return {begin, index, end};
      }
    }
  };

  proto.updateGetPathSelector = function( optPath ) {
  // parse href of link: '.next-page-link'
    const hrefElem = document.querySelector( optPath );
    if ( !hrefElem ) {
      console.error(`Bad InfiniteScroll path option. Next link not found: ${optPath}`);
      return;
    }

    const href = hrefElem.getAttribute('href');
    const pathParts = getPathParts( href );
    if ( !pathParts ) {
      console.error(`InfiniteScroll unable to parse next link href: ${href}`);
      return;
    }

    const {begin, index, end} = pathParts;
    this.isPathSelector = true; // flag for checkLastPage()
    this.getPath = () => begin + ( this.pageIndex + 1 ) + end;
    // get pageIndex from href
    this.pageIndex = parseInt( index, 10 ) - 1;
    this.log( 'pageIndex', [this.pageIndex, 'next link'] );
  };

  proto.updateGetAbsolutePath = function() {
    const path = this.getPath();
    // path doesn't start with http or /
    const isAbsolute = path.match( /^http/ ) || path.match( /^\// );
    if ( isAbsolute ) {
      this.getAbsolutePath = this.getPath;
      return;
    }

    const {pathname} = location;
    // query parameter #829. example.com/?pg=2
    const isQuery = path.match( /^\?/ );
    // /foo/bar/index.html => /foo/bar
    const directory = pathname.substring( 0, pathname.lastIndexOf('/') );
    const pathStart = isQuery ? pathname : directory + '/';

    this.getAbsolutePath = () => pathStart + this.getPath();
  };

  // -------------------------- nav -------------------------- //

  // hide navigation
  InfiniteScroll.create.hideNav = function() {
    const nav = utils.getQueryElement( this.options.hideNav );
    if ( !nav ) return;

    nav.style.display = 'none';
    this.nav = nav;
  };

  InfiniteScroll.destroy.hideNav = function() {
    if ( this.nav ) this.nav.style.display = '';
  };

  // -------------------------- destroy -------------------------- //

  proto.destroy = function() {
    this.allOff(); // remove all event listeners
    // call destroy methods
    for ( const method in InfiniteScroll.destroy ) {
      InfiniteScroll.destroy[method].call( this );
    }

    delete this.element.infiniteScrollGUID;
    delete instances[this.guid];
    // remove jQuery data. #807
    if ( jQuery && this.$element ) {
      jQuery.removeData( this.element, 'infiniteScroll' );
    }
  };

  // -------------------------- utilities -------------------------- //

  // https://remysharp.com/2010/07/21/throttling-function-calls
  InfiniteScroll.throttle = function( fn, threshold ) {
    threshold = threshold || 200;
    let last; let timeout;

    return function() {
      const now = +new Date();
      const args = arguments;
      const trigger = () => {
        last = now;
        fn.apply( this, args );
      };
      if ( last && now < last + threshold ) {
      // hold on to it
        clearTimeout( timeout );
        timeout = setTimeout( trigger, threshold );
      } else {
        trigger();
      }
    };
  };

  InfiniteScroll.data = function( elem ) {
    elem = utils.getQueryElement( elem );
    const id = elem && elem.infiniteScrollGUID;
    return id && instances[id];
  };

  // set internal jQuery, for Webpack + jQuery v3
  InfiniteScroll.setJQuery = function( jqry ) {
    jQuery = jqry;
  };

  // -------------------------- setup -------------------------- //

  utils.htmlInit( InfiniteScroll, 'infinite-scroll' );

  // add noop _init method for jQuery Bridget. #768
  proto._init = function() {};

  const {jQueryBridget} = window;
  if ( jQuery && jQueryBridget ) {
    jQueryBridget( 'infiniteScroll', InfiniteScroll, jQuery );
  }

  // --------------------------  -------------------------- //

  return InfiniteScroll;
} ) );
