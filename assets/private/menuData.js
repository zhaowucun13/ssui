ss.set(function(out){
    var menuData = {
        heeler: [
            {
                leader: '开发指南',
                txt: 'component',
                heeler: [
                    {
                        leader: '基础说明',
                        txt: 'component',
                        heeler: [
                            {
                                leader: '开始使用',
                                txt: 'use',
                            },
                            {
                                leader: '模块体系',
                                txt: 'module',
                            },
                            {
                                leader: '核心方法',
                                txt: 'method',
                            },
                        ]
                    }
                ]
            },
            {
                leader: '组件',
                txt: 'component',
                heeler: [
                    {
                        leader: 'Basic',
                        txt: 'Basic',
                        heeler: [
                            {
                                leader: 'Router 路由',
                                txt: 'router',
                            },
                            {
                                leader: 'Layout 布局',
                                txt: 'layout',
                            }
                        ]
                    },
                    {
                        leader: 'Navigation',
                        txt: 'Navigation',
                        heeler: [
                            {
                                leader: 'navMenu 仿小程序导航',
                                txt: 'navMenu',
                            }
                        ]
                    },
                    // {
                    //     leader: 'Form',
                    //     txt: 'Form',
                    //     heeler: [
                    //         {
                    //             leader: 'Radio 单选框',
                    //             txt: 'radio',
                    //         },
                    //         {
                    //             leader: 'Form 表单',
                    //             txt: 'form',
                    //         }
                    //     ]
                    // },
                    {
                        leader: 'Data',
                        txt: 'Data',
                        heeler: [
                            {
                                leader: 'Table 表格',
                                txt: 'table',
                            },
                            // {
                            //     leader: 'Badge 标记',
                            //     txt: 'badge',
                            // }
                        ]
                    },
                    {
                        leader: 'Notice',
                        txt: 'Notice',
                        heeler: [
                            {
                                leader: 'Alert 警告',
                                txt: 'alert',
                            },
                            {
                                leader: 'Loading 加载',
                                txt: 'loading',
                            },
                            // {
                            //     leader: 'MessageBox 弹框',
                            //     txt: 'messageBox',
                            // },
                        ]
                    },
                    {
                        leader: 'Others',
                        txt: 'supplier',
                        heeler: [
                            {
                                leader: 'Dialog 对话框',
                                txt: 'dialog',
                            },
                            {
                                leader: 'Tooltip 文字提示',
                                txt: 'tooltip',
                            },
                            {
                                leader: 'Popver 弹出框',
                                txt: 'popver',
                            },
                            {
                                leader: 'Card 卡片',
                                txt: 'card',
                            },
                            {
                                leader: 'Carousel 走马灯',
                                txt: 'carousel',
                            },
                            {
                                leader: 'Collapse 折叠面板',
                                txt: 'collapse',
                            },
                            {
                                leader: 'Code 代码装饰器',
                                txt: 'code',
                            },
                            {
                                leader: 'Api 简单列表展示',
                                txt: 'api',
                            }
                        ]
                    }
                ]
            }
        ]
    }
    out('menuData',menuData);
})

