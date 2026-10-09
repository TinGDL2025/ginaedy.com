/* OPCION B - Subrutina JS - aislada */
let AB_confirmados=0, AC_confirmados=0, S_confirmados=0;
let K_asignados=0, L_asignados=0, M_asignados=0;
let esFamiliaActual=false, vendranTodos=false;

function crearCheckboxes(){
  try{
    const cont=document.getElementById('listaChecks');
    const bloque=document.getElementById('bloqueCheckNombres');
    if(!cont || !bloque) return;
    const gStr = (typeof DATA_ACTUAL!=='undefined' && DATA_ACTUAL && DATA_ACTUAL.g) ? DATA_ACTUAL.g : (typeof grupoNombres!=='undefined'?grupoNombres:'');
    if(!gStr){ bloque.style.display='none'; return; }
    const nombres = gStr.split(',').map(s=>s.trim()).filter(Boolean);
    if(nombres.length===0){ bloque.style.display='none'; return; }
    cont.innerHTML='';
    nombres.forEach((nombre, idx)=>{
      const id='chk_'+idx;
      const div=document.createElement('div');
      div.style.cssText='display:flex;align-items:center;gap:10px;background:white;padding:10px 12px;border-radius:12px;border:1px solid #e8e0d6';
      div.innerHTML=`<input type="checkbox" id="${id}" value="${nombre}" checked onchange="actualizarDesdeChecks()" style="width:18px;height:18px"><label for="${id}" style="font-size:13px;flex:1;cursor:pointer">${nombre}</label>`;
      cont.appendChild(div);
    });
    bloque.style.display='block';
    actualizarDesdeChecks();
  }catch(e){ console.error('crearCheckboxes error', e); }
}

function seleccionarTodosChecks(valor){
  document.querySelectorAll('#listaChecks input[type=checkbox]').forEach(ch=>ch.checked=valor);
  actualizarDesdeChecks();
}

function actualizarDesdeChecks(){
  try{
    const checks=document.querySelectorAll('#listaChecks input[type=checkbox]:checked');
    const total=checks.length;
    const lista=Array.from(checks).map(c=>c.value);
    const resumen=document.getElementById('resumenCheck');
    const detalle=document.getElementById('detalleNoVienen');
    const inputQuienes=document.getElementById('quienes');
    
    if(resumen) resumen.textContent= total + ' de ' + document.querySelectorAll('#listaChecks input[type=checkbox]').length + ' seleccionados';
    
    // Calcular AB/AC - asume primeros K son adultos si esFamiliaActual? Simplificado: todos cuentan, luego se separa por tipo si tienes data
    // Para compatibilidad V22: AB = min(total, K), AC = resto
    const K = K_asignados || 0;
    const L = L_asignados || 0;
    // Heurística simple: si es familia, todos van a K+L
    AB_confirmados = Math.min(total, K);
    AC_confirmados = Math.min(Math.max(0, total - AB_confirmados), L);
    if(esFamiliaActual){
      AB_confirmados = Math.min(total, K);
      AC_confirmados = Math.min(Math.max(0, total - K), L);
      S_confirmados = AB_confirmados + AC_confirmados;
    }else{
      S_confirmados = 1 + AB_confirmados + AC_confirmados;
      if(total===0) S_confirmados=0;
    }
    
    if(inputQuienes) inputQuienes.value = lista.join(', ');
    
    const todos=document.querySelectorAll('#listaChecks input[type=checkbox]');
    const noVienen=Array.from(todos).filter(c=>!c.checked).map(c=>c.value);
    if(detalle){
      if(noVienen.length>0){
        detalle.style.display='block';
        detalle.textContent='No vienen: '+noVienen.join(', ');
      }else{
        detalle.style.display='none';
      }
    }
    
    // Actualizar contadores visuales si existen
    const abSpan=document.getElementById('abTxt');
    const acSpan=document.getElementById('acTxt');
    const sSpan=document.getElementById('sTxt');
    if(abSpan) abSpan.textContent=AB_confirmados;
    if(acSpan) acSpan.textContent=AC_confirmados;
    if(sSpan) sSpan.textContent=S_confirmados;
    
  }catch(e){ console.error('actualizarDesdeChecks error', e); }
}

// Exponer global
window.crearCheckboxes=crearCheckboxes;
window.seleccionarTodosChecks=seleccionarTodosChecks;
window.actualizarDesdeChecks=actualizarDesdeChecks;
