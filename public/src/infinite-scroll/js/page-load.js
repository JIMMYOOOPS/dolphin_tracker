// page-load
( function( window, factory ) {
  // universal module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
        window,
        require('./core'),
    );
  } else {
    // browser global
    factory(
        window,
        window.InfiniteScroll,
    );
  }
}( window, function factory( window, InfiniteScroll ) {
  const proto = InfiniteScroll.prototype;

  Object.assign( InfiniteScroll.defaults, {
  // append: false,
    loadOnScroll: true,
    checkLastPage: true,
    responseBody: 'text',
    domParseResponse: true,
  // prefill: false,
  // outlayer: null,
  } );

  InfiniteScroll.create.pageLoad = function() {
    this.canLoad = true;
    this.on( 'scrollThreshold', this.onScrollThresholdLoad );
    this.on( 'load', this.checkLastPage );
    if ( this.options.outlayer ) {
      this.on( 'append', this.onAppendOutlayer );
    }
  };

  proto.onScrollThresholdLoad = function() {
    if ( this.options.loadOnScroll ) this.loadNextPage();
  };

  const domParser = new DOMParser();

  proto.loadNextPage = function() {
    if ( this.isLoading || !this.canLoad ) return;

    let {responseBody, domParseResponse, fetchOptions} = this.options;
    const path = this.getAbsolutePath();
    this.isLoading = true;
    if ( typeof fetchOptions == 'function' ) fetchOptions = fetchOptions();

    const fetchPromise = fetch( path, fetchOptions )
        .then( ( response ) => {
          if ( !response.ok ) {
            const error = new Error( response.statusText );
            this.onPageError( error, path, response );
            return {response};
          }

          return response[responseBody]().then( ( body ) => {
            const canDomParse = responseBody == 'text' && domParseResponse;
            if ( canDomParse ) {
              body = domParser.parseFromString( body, 'text/html' );
            }
            if ( response.status == 204 ) {
              this.lastPageReached( body, path );
              return {body, response};
            } else {
              return this.onPageLoad( body, path, response );
            }
          } );
        } )
        .catch( ( error ) => {
          this.onPageError( error, path );
        } );

    this.dispatchEvent( 'request', null, [path, fetchPromise] );

    return fetchPromise;
  };

  proto.onPageLoad = function( body, path, response ) {
  // done loading if not appending
    if ( !this.options.append ) {
      this.isLoading = false;
    }
    this.pageIndex++;
    this.loadCount++;
    this.dispatchEvent( 'load', null, [body, path, response] );
    return this.appendNextPage( body, path, response );
  };

  proto.appendNextPage = function( body, path, response ) {
    const {append, responseBody, domParseResponse} = this.options;
    // do not append json
    const isDocument = responseBody == 'text' && domParseResponse;
    if ( !isDocument || !append ) return {body, response};

    const items = body.querySelectorAll( append );
    const promiseValue = {body, response, items};
    // last page hit if no items. #840
    if ( !items || !items.length ) {
      this.lastPageReached( body, path );
      return promiseValue;
    }

    const fragment = getItemsFragment( items );
    const appendReady = () => {
      this.appendItems( items, fragment );
      this.isLoading = false;
      this.dispatchEvent( 'append', null, [body, path, items, response] );
      return promiseValue;
    };

    // TODO add hook for option to trigger appendReady
    if ( this.options.outlayer ) {
      return this.appendOutlayerItems( fragment, appendReady );
    } else {
      return appendReady();
    }
  };

  proto.appendItems = function( items, fragment ) {
    if ( !items || !items.length ) return;

    // get fragment if not provided
    fragment = fragment || getItemsFragment( items );
    refreshScripts( fragment );
    this.element.appendChild( fragment );
  };

  function getItemsFragment( items ) {
  // add items to fragment
    const fragment = document.createDocumentFragment();
    if ( items ) fragment.append( ...items );
    return fragment;
  }

  // replace <script>s with copies so they load
  // <script>s added by InfiniteScroll will not load
  // similar to https://stackoverflow.com/questions/610995
  function refreshScripts( fragment ) {
    const scripts = fragment.querySelectorAll('script');
    for ( const script of scripts ) {
      const freshScript = document.createElement('script');
      // copy attributes
      const attrs = script.attributes;
      for ( const attr of attrs ) {
        freshScript.setAttribute( attr.name, attr.value );
      }
      // copy inner script code. #718, #782
      freshScript.innerHTML = script.innerHTML;
      script.parentNode.replaceChild( freshScript, script );
    }
  }

  // ----- outlayer ----- //

  proto.appendOutlayerItems = function( fragment, appendReady ) {
    const imagesLoaded = InfiniteScroll.imagesLoaded || window.imagesLoaded;
    if ( !imagesLoaded ) {
      console.error('[InfiniteScroll] imagesLoaded required for outlayer option');
      this.isLoading = false;
      return;
    }
    // append once images loaded
    return new Promise( function( resolve ) {
      imagesLoaded( fragment, function() {
        const bodyResponse = appendReady();
        resolve( bodyResponse );
      } );
    } );
  };

  proto.onAppendOutlayer = function( response, path, items ) {
    this.options.outlayer.appended( items );
  };

  // ----- checkLastPage ----- //

  // check response for next element
  proto.checkLastPage = function( body, path ) {
    const {checkLastPage, path: pathOpt} = this.options;
    if ( !checkLastPage ) return;

    // if path is function, check if next path is truthy
    if ( typeof pathOpt == 'function' ) {
      const nextPath = this.getPath();
      if ( !nextPath ) {
        this.lastPageReached( body, path );
        return;
      }
    }
    // get selector from checkLastPage or path option
    let selector;
    if ( typeof checkLastPage == 'string' ) {
      selector = checkLastPage;
    } else if ( this.isPathSelector ) {
    // path option is selector string
      selector = pathOpt;
    }
    // check last page for selector
    // bail if no selector or not document response
    if ( !selector || !body.querySelector ) return;

    // check if response has selector
    const nextElem = body.querySelector( selector );
    if ( !nextElem ) this.lastPageReached( body, path );
  };

  proto.lastPageReached = function( body, path ) {
    this.canLoad = false;
    this.dispatchEvent( 'last', null, [body, path] );
  };

  // ----- error ----- //

  proto.onPageError = function( error, path, response ) {
    this.isLoading = false;
    this.canLoad = false;
    this.dispatchEvent( 'error', null, [error, path, response] );
    return error;
  };

  // -------------------------- prefill -------------------------- //

  InfiniteScroll.create.prefill = function() {
    if ( !this.options.prefill ) return;

    const append = this.options.append;
    if ( !append ) {
      console.error(`append option required for prefill. Set as :${append}`);
      return;
    }
    this.updateMeasurements();
    this.updateScroller();
    this.isPrefilling = true;
    this.on( 'append', this.prefill );
    this.once( 'error', this.stopPrefill );
    this.once( 'last', this.stopPrefill );
    this.prefill();
  };

  proto.prefill = function() {
    const distance = this.getPrefillDistance();
    this.isPrefilling = distance >= 0;
    if ( this.isPrefilling ) {
      this.log('prefill');
      this.loadNextPage();
    } else {
      this.stopPrefill();
    }
  };

  proto.getPrefillDistance = function() {
  // element scroll
    if ( this.options.elementScroll ) {
      return this.scroller.clientHeight - this.scroller.scrollHeight;
    }
    // window
    return this.windowHeight - this.element.clientHeight;
  };

  proto.stopPrefill = function() {
    this.log('stopPrefill');
    this.off( 'append', this.prefill );
  };

  // --------------------------  -------------------------- //

  return InfiniteScroll;
} ) );
