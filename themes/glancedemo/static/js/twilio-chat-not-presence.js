jQuery(window).ready(()=> {
          const appConfig = {
            accountSid: "ACed09bac96930c7f93887faa7d1be9136",
            flexFlowSid: "FW6df8d491707ec52a12386b3e626e892e", // "FOdaee9774acf90f0d012a1acdc158b3aa",
           context: {
            friendlyName: null /* is logged in ? then = Jennifer Smith, else = anonymous */
           },
           startEngagementOnInit: true
          };
            console.log('Twilio Web Chat');
          Twilio.FlexWebChat.createWebChat(appConfig)
                .then(webchat => {
                    const { manager } = webchat;
                  Twilio.FlexWebChat.Actions.on("afterToggleChatVisibility", () => {
                    const {channelSid} = manager.store.getState().flex.session;
                    manager
                      .chatClient.getChannelBySid(channelSid)
                      .then(channel => {
                        console.log(channel.sid);
                        let visitor = new GLANCE.Presence.Visitor({
                          groupid: document.getElementById("glance-cobrowse").getAttribute("data-groupid"),
                          visitorid: channel.sid
                        });
                        visitor.onerror = function (e) {
                          console.log("presence error:", e);
                        };
                        visitor.presence({
                          data: {mydata: "abc", myotherdata: 99999},
                          onsuccess: function () {
                            console.log("presence success");
                          }
                          // errors will be reported through onerror event
                        });
                        visitor.onsignal = function (msg) {
                          console.log("received signal:", e);
                        };
                        visitor.connect(); // not sure this is needed now because .presence() connects
                      });
                  });
                  webchat.init();
                });
});
