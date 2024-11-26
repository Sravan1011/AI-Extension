chrome.runtime.onInstalled.addListener((()=>{chrome.storage.local.set({tasks:[]},(()=>{console.log("Storage initialized")}))})),chrome.runtime.onMessage.addListener(((e,t,s)=>{if("CREATE_TASK"===e.type){const t=e.task;if(t.scheduledDate){const e=new Date(t.scheduledDate).getTime();chrome.alarms.create(`task-${t.id}`,{when:e})}s({success:!0})}return!0})),chrome.alarms.onAlarm.addListener((e=>{if(e.name.startsWith("task-")){const t=e.name.split("-")[1];chrome.storage.local.get(["tasks"],(e=>{const s=(e.tasks||[]).find((e=>e.id.toString()===t));s&&function(e){chrome.notifications.create("",{type:"basic",iconUrl:"icons/icon48.png",title:"Task Due",message:e.title,priority:"High"===e.priority?2:1})}(s)}))}}));
//# sourceMappingURL=background.js.map