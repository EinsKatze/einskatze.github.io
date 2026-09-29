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
  if(script?.dataset.copyEnabled==='true')document.querySelectorAll('pre').forEach(pre=>{
    const code=pre.querySelector('code');
    const codeText=code?.innerText??pre.innerText;
    const button=document.createElement('button');
    button.className='copy-code';button.type='button';button.textContent=copyLabel;
    button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(codeText);button.textContent=copiedLabel;setTimeout(()=>button.textContent=copyLabel,1400);}catch(_){button.textContent=failedLabel;}});
    pre.append(button);
  });
})();
