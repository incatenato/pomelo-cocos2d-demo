/**
 * Created by yangyanfei on 6/2/16.
 */



cc.BuilderReader.registerController("LoadingCtrl",{
    _progress:null,
    onDidLoadFromCCB:function(){
        // this.addProgressTimer();
        this["tip"].setString(GameTool.getTip());
    },
    completedAnimationSequenceNamed:function(animationName){

    },
    // addProgressTimer:function(){
    //     this._progress = new cc.ProgressTimer(new cc.Sprite("#p_loading_001.png"));
    //     this._progress.setType(cc.ProgressTimer.TYPE_BAR);
    //     this._progress.setMidpoint(cc.p(0,0.5));
    //     this._progress.setAnchorPoint(cc.p(0,0));
    //     this._progress.setBarChangeRate(cc.p(1,0));
    //     this["progressBg"].addChild(this._progress);
    // },
    changeProgressTimer:function(percent){
        // this._progress.setPercentage(percent);
        this["progressLabel"].setString( percent+ "%");
    }
});