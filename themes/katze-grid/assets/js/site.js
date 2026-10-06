(function(){
  const topButton=document.querySelector('.scroll-top');
  if(topButton){
    const updateTopButton=()=>{topButton.hidden=document.documentElement.scrollHeight<=window.innerHeight+2||window.scrollY<160;};
    window.addEventListener('scroll',updateTopButton,{passive:true});
    window.addEventListener('resize',updateTopButton);
    topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
    updateTopButton();
  }
  const script=document.currentScript;
  const copyLabel=script?.dataset.copyLabel||'COPY';
  const copiedLabel=script?.dataset.copiedLabel||'COPIED';
  const failedLabel=script?.dataset.failedLabel||'FAILED';
  document.querySelectorAll('.copy-link').forEach(button=>{
    button.hidden=false;
    const status=button.parentElement.querySelector('.copy-link-status');
    let resetTimer;
    button.addEventListener('click',async()=>{
      clearTimeout(resetTimer);
      try{
        await navigator.clipboard.writeText(button.dataset.url);
        button.textContent=button.dataset.copiedLabel;
        if(status)status.textContent=button.dataset.copiedLabel;
      }catch(_){
        button.textContent=button.dataset.failedLabel;
        if(status)status.textContent=button.dataset.failedLabel;
      }
      resetTimer=setTimeout(()=>{button.textContent=button.dataset.copyLabel;if(status)status.textContent='';},2000);
    });
  });
  if(script?.dataset.copyEnabled==='true')document.querySelectorAll('pre').forEach(pre=>{
    const code=pre.querySelector('code');
    const codeText=code?.innerText??pre.innerText;
    const button=document.createElement('button');
    button.className='copy-code';button.type='button';button.textContent=copyLabel;
    button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(codeText);button.textContent=copiedLabel;setTimeout(()=>button.textContent=copyLabel,1400);}catch(_){button.textContent=failedLabel;}});
    pre.append(button);
  });
})();
