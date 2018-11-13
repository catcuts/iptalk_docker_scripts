# -*- coding: utf-8 -*-

"""
   操作dict,list,set等的工具函数
"""

__author__ = 'ZhangWeiXiong,wxzhang@126.com'

def merge_dict(dict1, dict2):
    """
        递归合并两个字典,支持递归调用合并
    """
    for key, val in list(dict2.items()):
        if (key in dict1 and isinstance(dict1[key], dict) and
                            isinstance(val, dict)):
            merge_dict(dict1[key],(val))
        else:
            dict1[key] = val


def filter_dict_items(inDict,keys,reverse=False):
    """
        从字典中移除指定keys的项,如果指定reverse=True,则保留keys项，其余均删除
    """
    if hasattr(keys, '__iter__'):
        if reverse:
           inDict=filter(lambda item: item[0] in keys,inDict.items())
        else:
            for key in keys:
                try:
                    del inDict[key]
                except:
                    pass
        return inDict
    else:
        if isinstance(keys,str):
            keys=keys.split(",")
            return filter_dict_items(inDict,keys,reverse)

def filter_dict_from_keys(in_dict,keys):
    """
    返回指定keys的字典
    跟filter_dict_items的区别是：
    filter_dict_items是在原字典上进行修改
    而filter_dict_from_keys则是返回一个新字典
    例：
    out=get_from_keys({"a":1,"b":2,"c":3},["a","c"])
    out={"a":1,"c":3}
    :param in_dict:输入字典
    :param keys:字典健列表
    :return:
    """
    if keys is None:
        keys=[]
    try:
        out_dict= { item[0]:item[1] for item in in_dict.items() if item[0] in keys}
    except:
        out_dict=in_dict.copy()
    return out_dict

def params_to_dict(params,splitchar="&"):
    """ 将类似param1=111111,param2=2222的字符串，转换成
        {param1:1111,param2:2222}
    """
    params=params.replace(u"，",",")
    params=params.split(splitchar)
    param_dict={}
    try:
        try:
            param_dict={param[0:param.index("=")]:param[param.index("=")+1:] for param in params}
        except:#当传入的字符串错误时，不使用字典推导式
            for param in params:
                if len(param)>0:
                    if param.find("=")==-1:
                        param_dict[param]=""
                    else:
                        param_dict[param[0:param.index("=")]]=param[param.index("=")+1:]
    except:
        param_dict={}
    return param_dict