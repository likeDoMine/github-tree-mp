import apis from '../../apis/index'
import app from '../../utils/index'

apis.setResp('https://github.com/Youjingyu/vue-hap-tools/')

interface IndexPage extends IPage {}

class IndexPage {

  public data = {
    code: {
      nodes: []
    },
    codeRows: [],
    loadCodeError: false
  }

  public onLoad() {
    apis.getBlob('/bin/vue-hap.js').then((codeString) => {
      let html = app.globalUtils.hightlight.highlight('javascript', codeString).value
      let codeSegments = html.split(/\n/)
      const codeRows:Array<object> = []
      codeSegments.forEach((segment:string) => {
        const res:Array<object> = []
        const spaces = segment.match(/^(\s+)</)
        if (spaces) {
          res.push({
            text: spaces[1]
          })
        }
        const htmlJson = app.globalUtils.html2json(segment)
        htmlJson.nodes.forEach((node:any) => {
          if (node.node === 'text') {
            res.push({
              text: node.text
            })
          } else if (node.node === 'element') {
            res.push({
              class: node.classStr,
              text: node.nodes[0].text
            })
          }
        })
        codeRows.push(res)
      });
      this.setData({
        codeRows: codeRows
      })
      // app.globalUtils.wxParse('code', 'html', html, this, 5)
    }).catch(() => {
      this.data.loadCodeError = true
    })
  }
}

Page(new IndexPage())