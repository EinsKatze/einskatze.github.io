(function(){
  const html=document.documentElement;
  const fitShortHomepage=()=>{
    if(document.body.dataset.homePage!=='true')return;
    html.classList.toggle('home-no-scroll',html.scrollHeight-window.innerHeight<=24);
  };
  window.addEventListener('resize',fitShortHomepage);
  fitShortHomepage();
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
    const button=document.createElement('button');
    button.className='copy-code';button.type='button';button.textContent=copyLabel;
    button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(pre.innerText);button.textContent=copiedLabel;setTimeout(()=>button.textContent=copyLabel,1400);}catch(_){button.textContent=failedLabel;}});
    pre.append(button);
  });
})();
