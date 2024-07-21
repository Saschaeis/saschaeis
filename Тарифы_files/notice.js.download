jQuery.widget( 'gc.noticeWidget', {
	containerElemDOMSelector: '.gc-both-main-content',

	options: {
		needLoad: false
	},

	_create: function() {

		var self = this;
		this.load();
	},
	load: function() {
		//alert("E")
	},

	setContainer: function(selector) {
		this.containerElemDOMSelector = selector;
	},

	getContainer: function() {
		return this.containerElemDOMSelector;
	},

	addNotice: function( noticeData ) {
		this.showNotice( noticeData );
	},

	showNotice: function( noticeData ) {

		switch( noticeData.type ) {
			case "modal":
				this.showModal( noticeData );
            	break;
			default:
				this.showTopPanel( noticeData );
				break;
		}
	},

	showTopPanel: function( noticeData ) {
		var self = this;

		var $el = $('<div class="notice-top-panel"></div>')
		$el.addClass( 'gc-into-main-content' );
		//$el.addClass('alert alert-' + noticeData.messageType )

		$el.html( noticeData.text )

		if ( noticeData.button ) {
			$buttonEl = $('<button class="btn btn-default">' +  noticeData.button + '</button>')
            $buttonEl.appendTo( $el )
		}

		if (noticeData.showCloseControl) {
			$closeEl = $('<span class="close-link">&times;</span>');
			$closeEl.prependTo($el);

			$closeEl.click( function(e) {
				$el.hide();
				e.preventDefault();
				e.stopPropagation();
			});
		}

		$el.appendTo( $(self.getContainer()) );

		$(self.getContainer()).prepend($('<div class="margin-top-notice"></div>').css({"margin-top": (Math.floor($el.height() * 2)) + "px"}));

		var isOpen = $('#' + noticeData.popupType).is(':visible');

		if ( noticeData.popupType && noticeData.showPopupByTimeout && !isOpen) {
			if (document.cookie.indexOf(noticeData.popupType) == -1) {
				window.setTimeout(function() {
					document.cookie = noticeData.popupType + "=true";

					if (!isOpen) {
						gcFixIncident('show-modal-by-time', noticeData.showPopupByTimeout + '');
						self.openPopup(noticeData);
					}
				}, noticeData.showPopupByTimeout * 1000);
			}
		}

		if (noticeData.noticeActionJs) {
			eval(noticeData.noticeActionJs);
		}

		$el.click( function() {
			if ( noticeData.popupType ) {
				self.openPopup( noticeData );
			}
			if ( noticeData.callback ) {
				noticeData.callback();
			}
			else {
				eval( noticeData.actionJs );
			}
		} );
	},

	showModal: function( noticeData ) {
	},

	openPopup: function( noticeData ) {
		var self = this;

		ajaxCall( "/pl/cms/popup/get?type=" + noticeData.popupType + '&parentUrl=' + window.encodeURIComponent(noticeData.parentUrl), {}, {}, function( response ) {
			if ( ! self.modal ) {
				self.modal = window.gcModalFactory.create({show: false, width: response.data.width });
				self.modal.getModalEl().addClass( 'gc-notice-modal' )
			}
            if ( response.data.title ) {
                self.modal.getHeaderEl().html( response.data.title );
            }
            self.modal.setContent( response.data.html );
            self.modal.getModalEl().find('.modal-dialog').css('top', response.data.topMargin);
            self.modal.show();
            //self.modal.alignVertical();

            self.initModal( noticeData.popupType, self.modal.getContentEl() );
		})

		//alert( noticeData.popupType )
	},

	initModal: function( type, $contentEl ) {
		var self = this;

		$contentEl.find('.btn-cancel-modal').click( function() {
            self.modal.hide();
        })



		$contentEl.find( 'form' ).submit( function() {

			var data = $(this).serialize();
			var $form = $(this);

			$form.addClass('loading')
			$contentEl.find('.error-block').hide();

			ajaxCall( "/pl/cms/popup/process?type=" + type, data, {}, function( response ) {
				if ( response.data.htmlErrorMessage ) {
                    $contentEl.find('.error-block').html( response.data.htmlErrorMessage );
                    $contentEl.find('.error-block').show();
                }
				if ( response.data.htmlAfterProcess ) {
					var $addEl = $(response.data.htmlAfterProcess);
					$addEl.appendTo( $contentEl );
				}
			}, function() {
				$form.removeClass('loading')
			} );

			return false;
		})
	}
} );

