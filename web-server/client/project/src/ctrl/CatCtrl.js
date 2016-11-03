/**
 * Created by yangyanfei on 6/2/16.
 */



cc.BuilderReader.registerController("CatCtrl",{
    isHurting:false,
    onDidLoadFromCCB:function(){
        cc.log("catCtrl didLoadFinished");
    },
    completedAnimationSequenceNamed:function(animationName){
        cc.log("catCtrl finished");
        if(animationName === "hurt")
        {
            this.isHurting = false;
        }
    },
    playShoot:function () {
        this.rootNode.animationManager.runAnimationsForSequenceNamed("shoot");
    },
    playHurt:function () {
        this.rootNode.animationManager._delegate = this ;
        if(this.isHurting === false) {
            cc.audioEngine.playEffect(res_music.music_call);
            this.rootNode.animationManager.runAnimationsForSequenceNamed("hurt");
            this.isHurting = true;
        }
    }

});