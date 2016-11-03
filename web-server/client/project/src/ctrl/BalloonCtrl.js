/**
 * Created by yangyanfei on 6/2/16.
 */



cc.BuilderReader.registerController("BalloonCtrl",{

    onDidLoadFromCCB:function(){
    },
    completedAnimationSequenceNamed:function(animationName){
        if(animationName === "disappear")
        {
            this.rootNode.removeFromParent(true);
        }
    },

    playDisappear:function () {
        this.rootNode.animationManager._delegate = this ;
        this.rootNode.animationManager.runAnimationsForSequenceNamed("disappear")
    }
});