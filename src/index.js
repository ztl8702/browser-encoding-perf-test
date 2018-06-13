import { RecordingController } from './RecordingController';

export * from './RecordingController';

window.runTest = function (format = 'wav') {
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
            }, 10000);
    },1000);
}



