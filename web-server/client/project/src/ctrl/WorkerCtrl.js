/**
 * Created by yangyanfei on 6/2/16.
 */



cc.BuilderReader.registerController("WorkerCtrl",{
    isWorking:false,
    onDidLoadFromCCB:function(){
    },
    completedAnimationSequenceNamed:function(animationName){
        if(animationName === "working"){
            this.isWorking = false;
        }
    },
    playWorkingAnimation:function () {
        this.rootNode.animationManager._delegate = this ;
        if(this.isWorking === false) {
            this.rootNode.animationManager.runAnimationsForSequenceNamed("working");
            this.isWorking = true;
        }

    }

});