var states = {
    name: '',
    msgs: []
};
(function(){
    function init(){
      // Init F7 Vue Plugin
      Vue.use(Framework7Vue)

      // Init Page Components
      Vue.component('page-about', {
        template: '#page-about'
      })
      Vue.component('page-form', {
        template: '#page-form'
      })
      Vue.component('page-dynamic-routing', {
        template: '#page-dynamic-routing'
      })
      Vue.component('page-chat', {
        template: '#page-chat',
        data: function(){
          return states;
        },
        // handle onSend
        methods: {
          onSend: function(text, clear){
            console.log("clicked") 
            var message = {
                name: this.name,
                text: text 
            }
            axios.post('http://192.168.200.26:9999/message', message);
            if( typeof clear == 'function' ) clear()
          }
        }
      });

      // Init App
      new Vue({
        el: '#app',
        data: function(){
          return states;
        },
        // Init Framework7 by passing parameters here
        methods: {
          enterChat: function(){
            if(this.name.trim().length === 0 ){
              alert(" Enter your name ...")
              return false;
            }
            this.msgs.length = 0;
            this.$f7.mainView.router.load({url:'/chat/'});
          },
          getImage: function(){
            console.log("getImage");
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY, 
                    allowEdit: true,
                    destinationType: Camera.DestinationType.FILE_URI
                });
          }
        },
        framework7: {
          root: '#app',
          /* Uncomment to enable Material theme: */
          // material: true,
          routes: [
            {
              path: '/about/',
              component: 'page-about'
            },
            {
              path: '/form/',
              component: 'page-form'
            },
            {
              path: '/dynamic-route/blog/:blogId/post/:postId/',
              component: 'page-dynamic-routing'
            },
            {
              path: '/chat/',
              component: 'page-chat'
            }
          ],
        }
      });
    }  
    // Change image source
            function onSuccess(imageData) {
                var image = document.getElementById('img');
                image.src = imageData + '?' + Math.random();
                alert(imageData);
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
    // Handle device ready event
    document.addEventListener('deviceready', init, false)
    const pusher = new Pusher('fe9008fc9f09d31506c0', {
      cluster: 'ap1',
      encrypted: true,
    });
    const channel = pusher.subscribe('chat');
    channel.bind('message', data => {
      console.log(data)
      var type = data.name == states.name ? 'sent':'received'
      var name = type == 'sent'? states.name : data.name;
      states.msgs.push({name:name, text:data.text, type:type});
    });
})();


