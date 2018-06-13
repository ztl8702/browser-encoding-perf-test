import { RecordingController } from './RecordingController';

export * from './RecordingController';

window.runTest = function (format = 'wav', seconds = 30) {
    let a = new RecordingController(format);
    console.log('Test format', format);

    setTimeout(()=>
    {
        console.log("Test starts");
        a.startRecording();
        
        setTimeout(
            ()=> {
                a.stopRecording().then(
                    ()=>{
                        console.log('Recording stopped.');
                        a.downloadRecordedData();
                        console.log('Download triggered');
                    })
            }, seconds * 1000);
    },1000);
}



