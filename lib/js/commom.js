var IN_BROWSER = typeof window !== 'undefined';
var IN_WEEX = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var WEEX_PLATFORM = IN_WEEX && WXEnvironment.platform.toLowerCase();
var UA = IN_BROWSER && window.navigator.userAgent.toLowerCase();
var IS_IE = UA && /msie|trident/.test(UA);
var IS_IE_9 = UA && UA.indexOf('msie 9.0') > 0;
var IS_EDGE = UA && UA.indexOf('edge/') > 0;
var iS_ANDROID = (UA && UA.indexOf('android') > 0) || (WEEX_PLATFORM === 'android');
var iS_IOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (WEEX_PLATFORM === 'ios');
var IS_CHROME = UA && /chrome\/\d+/.test(UA) && !IS_EDGE;
var PRINT_HTML = {}
PRINT_HTML.ITEM_7 = `
                        <td style="text-align: center; border: solid 1px black;word-break:break-word;width: 5%;max-width: 5%;">{{args1}}</td>
                        <td style="text-align: center; border: solid 1px black;word-break:break-word;width: 12%;max-width: 12%;">{{args2}}</td>
                        <td style="text-align: center; border: solid 1px black;word-break:break-word;width: 12%;max-width: 12%;">{{args3}}</td>
                        <td style="text-align: center; border: solid 1px black;word-break:break-word;width: 10%;max-width: 10%;">{{args4}}</td>
                        <td style="text-align: center; border: solid 1px black;word-break:break-word;width: 10%;max-width: 10%;">{{args5}}</td> 
                        <td style="text-align: center; border: solid 1px black;word-break:break-word;width: 10%;max-width: 10%;">{{args6}}</td>
                        <td style="text-align: center; border: solid 1px black;word-break:break-word;width: 12%;max-width: 12%;">{{args7}}</td>
                    `
PRINT_HTML.SUYUAN_CODE = `
                            <div style="font-size: 13px;height: 30px;line-height: 30px;border-bottom: 1px solid #000000;margin-bottom: 5px;">
                                商家编号:
                                <span style="font-weight: bolder;font-size: 15px;padding-left:30px;">{{args1}}</span>
                                <span style="font-weight: bolder;font-size: 15px;padding-left:10px;">{{args2}}</span>
                            </div>
                            <div style="font-size: 13px;height: 20px;line-height: 20px;">商家:{{args3}}</div>
                            <div style="font-size: 13px;height: 20px;line-height: 20px;">商品:{{args4}}</div>
                            <div style="font-size: 13px;height: 20px;line-height: 20px;">分拣量:{{args5}}</div>
                            <div style="font-size: 13px;height: 20px;line-height: 20px;">分拣人员:</div>
                            <div style="font-size: 13px;height: 20px;line-height: 20px;margin-bottom: 2px;">{{args6}}</div>
                            <div style="text-align: center;font-size: 12px;height: 20px;line-height: 20px;">{{args7}}</div>
                        `
PRINT_HTML.ORDER_ITEM = `
                            <tr>
                                ${PRINT_HTML.ITEM_7}    
                                <td style="text-align: center; border: solid 1px black;word-break:break-word;width: 29%;max-width: 29%;">{{args8}}</td>                  
                            </tr>
                        `
PRINT_HTML.DELIVER_ITEM = `
                            <tr>
                                ${PRINT_HTML.ITEM_7}                
                            </tr>
                        ` 
PRINT_HTML.DELIVER_SORTTOTAL = `
                                <tr>
                                   <td style="text-align: center; border: solid 1px black;word-break:break-word;">合计</td>
                                   <td style="text-align: center; border: solid 1px black;word-break:break-word;" ></td>
                                   <td style="text-align: center; border: solid 1px black;word-break:break-word;"></td>
                                   <td style="text-align: center; border: solid 1px black;word-break:break-word;"></td>
                                   <td style="text-align: center; border: solid 1px black;word-break:break-word;"></td>
                                   <td style="text-align: center; border: solid 1px black;word-break:break-word;" colspan="2">{{args1}}</td>
                                </tr>
                            `                                                  
PRINT_HTML.ORDER_MAIN = `
                            <div style="position: relative;text-align: center;height: 20px;line-height: 20px;font-size: 20px;">
                                <span>{{args1}}</span>                                    
                            </div>
                            <div style="position: relative;height: 20px;line-height: 20px;font-size: 13px;">
                                <span style="position: absolute;left: 0;">供货商电话: {{args2}}</span> 
                                <span style="position: absolute;right: 0;">订单号: {{args3}}</span>                                         
                            </div>
                            <div style="position: relative;height: 20px;line-height: 20px;font-size: 13px;">
                                <span style="position: absolute;left: 0;">购货单位: {{args4}}</span>
                                <span style="position: absolute;right: 0;">分拣编码: {{args5}}</span>                                    
                            </div>
                            <div style="position: relative;min-height: 20px;font-size: 13px;">
                                <div style="text-align: left;word-break:break-all;padding-right: 180px;">收货人: {{args6}}</div>      
                                <div style="position: absolute;right: 0;top: 0;">收货人电话: {{args7}}</div>                                    
                            </div>
                            <div style="position: relative;height: 20px;line-height: 20px;font-size: 13px;">
                                <span style="position: absolute;left: 0;">配送时间: {{args9}}</span>
                            </div>
                            <div style="font-size: 13px;word-break:break-all;">
                                配送地址: {{args8}}
                            </div>
                            <table style="text-align: center; border-collapse: collapse; width: 100%;word-wrap:break-all;">
                              <thead style="font-size:14px;">
                                  <tr>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">序号</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">商品名称</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格名称</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">单价(元)</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">下单量</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">分拣量</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">分拣合计(元)</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">客户备注</th>
                                  </tr>
                              </thead>
                              {{args10}}
                            </table>
                            <div style="position: relative;min-height: 20px;line-height: 20px;font-size: 13px;">
                                <span style="margin-right: 5px;">打印合计总额(元): {{args11}}</span>
                                <span style="margin-right: 5px;">订单总额(元): {{args12}}</span>
                                <span style="margin-right: 5px;">打印合计实配金额(元): {{args13}}</span>                                    
                                <span>实配金额(元): {{args14}}</span>                                  
                            </div>
                            <div style="position: relative;height: 30px;line-height: 30px;font-size: 13px;">
                                <span style="width: 25%;display: inline-block;">{{args15}}: </span>
                                <span style="width: 25%;display: inline-block;">{{args16}}: </span>
                                <span style="width: 25%;display: inline-block;">{{args17}}: </span>                                      
                            </div>
                        `
PRINT_HTML.STOCK_DETAIL = `
                            <tr>
                              <td style="text-align: center; border: solid 1px black;word-break:break-word;">{{args1}}</td>
                              <td style="text-align: center; border: solid 1px black;word-break:break-word;">{{args2}}</td>
                              <td style="text-align: center; border: solid 1px black;word-break:break-word;">{{args3}}</td>
                              <td style="text-align: center; border: solid 1px black;word-break:break-word;">{{args4}}</td>
                              <td style="text-align: center; border: solid 1px black;word-break:break-word;">{{args5}}</td>
                              <td style="text-align: center; border: solid 1px black;word-break:break-word;">{{args6}}</td>
                              <td style="text-align: center; border: solid 1px black;word-break:break-word;">{{args7}}</td>
                              <td style="text-align: center; border: solid 1px black;word-break:break-word;">{{args8}}</td>
                              <td style="text-align: center; border: solid 1px black;word-break:break-word;">{{args9}}</td>
                              <td style="text-align: center; border: solid 1px black;word-break:break-word;">{{args10}}</td>
                              <td style="text-align: center; border: solid 1px black;word-break:break-word;">{{args11}}</td>
                              <td style="text-align: center; border: solid 1px black;word-break:break-word;">{{args12}}</td>
                            </tr>
                          `
PRINT_HTML.STOCK_MAIN = `
                          <div style="position: relative;text-align: center;height: 50px;line-height: 50px;font-size: 18px;">
                              <span>库存状况明细单</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 50px;line-height: 50px;font-size: 16px;">
                              <span style="position: absolute;left: 0;">商品编码: {{args1}}</span>
                          </div>
                          <div style="position: relative;text-align: center;height: 50px;line-height: 50px;font-size: 16px;">
                              <span style="position: absolute;left: 0;">商品名称: {{args2}}</span>
                               <span style="position: absolute;right: 0;">所属分类: {{args3}}</span>
                          </div>
                          <table style="text-align: center; border-collapse: collapse; width: 100%;margin-bottom: 100px;">
                              <thead style="font-size:18px;">
                                  <tr>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">时间</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">库存变化类型</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">商品名称</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格名</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">库存量（规格单位）</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">库存量(基本单位)</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">基本单位变化数量</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">基本单位变化单价</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格变化数量</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">规格变化单价</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">收入/支出</th>
                                      <th style="text-align: center; border: solid 1px black;word-break:break-word;">金额(元)</th>
                                  </tr>
                              </thead>
                              {{args4}}
                          </table>
                          <div style="page-break-after: always;"></div>
                        `