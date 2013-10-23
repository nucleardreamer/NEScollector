var app = {

    initialize: function() {
        this.bindTmpls();
        this.bindEvents();
        this.gamesById = {};
        this.gamesByName = {};
    },
    bindTmpls: function(){
        $('script[type="text/x-jsrender"]').each(function(){
            var item = $(this);
            jsviews.templates(item.attr('id'), item.html());
        });
    },
    bindEvents: function() {
        var _this = this;
        $(document).on('deviceready', function(e){
            _this.onDeviceReady();
        })
        $('.header').on('touchmove', function(e){
             e.preventDefault();
        });
        $('.header input').live('keyup', function(e){
            if(e.keyCode == 13){
                $(this).blur()
            }
            var val = $(this).val();
            var pat = new RegExp(val,'gi'),
                cont = $('.app .content');
            cont.html('');

            if(val){
                var toRender = [];
                for(item in _this.gamesByName){
                    if(pat.test(item)){
                        if(toRender.length < 10){
                            toRender.push(_this.gamesByName[item]);
                        }    
                    }
                }
                cont.append(jsviews.render.itemTmpl(toRender))
                _this.toggleItemBind();
                _this.toggleAddBind();
            }
        });
        $('.header .list').tap(function(){
            var cont = $('.app .content'),
                toRender = [],
                from = 0,to = 0;
            cont.html('');
            for(key in _this.gamesById){
                to++;
                if($.inArray(key, Object.keys(localStorage)) >= 0){
                    from++;
                    toRender.push(_this.gamesById[key]);
                }
            }
            console.log(to)
            cont.append(jsviews.render.progressTmpl({
                from: from,
                to: to,
                percent: (Math.floor(to / from) / 100)
            }))
            cont.append(jsviews.render.itemTmpl(toRender))
            _this.toggleItemBind();
            _this.toggleAddBind();
        });
        $('.header .settings').tap(function(){
            $('body').addClass('right');
            $('.app').one('click', function(){
                $('body').removeClass('right')
                return false;
            })
        });
        $('.header .clear').tap(function(){
            $('.header input').val('').blur();
        });
        
    },
    toggleItemBind: function(){
        $('.item').tap(function(e){
            if($(this).hasClass('active')){
                $(this).removeClass('active')
            } else {
                $('.item').removeClass('active');
                $(this).addClass('active');
            }
        });
    },
    toggleAddBind: function(){
        $('.item .add').tap(function(e){
            var id = $(this).attr('data-id');
            localStorage[id] = true;
            $(this).parents('.item').addClass('owned');
        });
        $('.item .remove').tap(function(e){
            var id = $(this).attr('data-id');
            delete window.localStorage[id];
            $(this).parents('.item').removeClass('owned');
        });
    },
    onDeviceReady: function() {
        var _this = this;
        
        console.log('fucking ready');
        $.get('js/NES.js', function(d){
            d = JSON.parse(d);
            $.each(d, function(i, e){
                // clean titles
                e[0].Title = e[0].Title.replace(/\([^)]*\)/g,'').replace(/[^\w\s:\.,]/gi, '');
                _this.gamesById[e[0].ProductID[0].Value] = e[0];
                _this.gamesByName[e[0].Title] = e[0];
            });
            console.log(_this.gamesByName);
        });
    },

};
jsviews.views.helpers({
    checkOwned: function(id){
        return (localStorage[id]) ? 'owned' : '';
    },
    photo: function(e){
        return (typeof e !== 'undefined' && e) ? e : 'null';
    },
    catArray: function(e){
        return (typeof e == 'array') ? e.join(', ') : e;
    }
})
