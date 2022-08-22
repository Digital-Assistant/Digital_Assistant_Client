/**
 * Toggles(squeeze) content body element width
 * @param hide 
 */
export const squeezeBody = (hide: boolean) => {
    const _body = document.body;
    if (_body) {
      _body.style.width = !hide ? '' : (window.innerWidth - 350) + 'px';
    }
}

/**
 * to render search result rows
 */
export const getRowObject= (data:any)=>{
    let path='';
    for(let row of data.userclicknodesSet){
      if(path!==''){
        path +=' >> ';
      }
      path += row.clickednodename;
    }
    let sequenceName = '';
    try{
      sequenceName = JSON.parse(data.name)[0];
    } catch (e) {
      sequenceName = data.name.toString();
    }
    return {sequenceName, path}
}