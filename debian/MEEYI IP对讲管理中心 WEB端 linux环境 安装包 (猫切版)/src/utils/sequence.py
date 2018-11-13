# -*- coding:utf-8 -*-
__author__ = 'zhwx'

def remove_list_repeat(ls=[],remove_empty=True):
    """
    移动列表中的重复项，并且尽最大可能保持列表顺序
    :param ls:
        ls=[1,2,3,1,23]
        ls=[1,2,3,23]
    :param remove_empty: 移除空项
    :return:
    """
    for item in ls[::-1]:
        if remove_empty and not item:
            del ls[ls.index(item)]
        else:
            while ls.count(item)>1:
                del ls[ls.index(item,ls.index(item)+1)]
    return ls

