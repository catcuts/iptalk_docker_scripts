# -*- coding:utf-8 -*-
from settings import Settings
from devices.iptalk.language.zh_CN import L as zh
from devices.iptalk.language.en_US import L as en

_mapping = {
    'en-US': en,
    'zh-CN': zh,
}
_language = Settings.get("language")['language']  # 配置语言
_input = 'zh-CN'  # 输入语言
_default = 'en-US'  # 默认语言
_input_temp = {}  # 这里对输入语言进行键值对互换，增加翻译的遍历速度
for key, value in _mapping[_input].items():
    _input_temp[value] = key


def language(msg, language="auto"):
    if language == "auto":
        language = _language
    if _input == language:  # 判断是否需要转换
        return msg
    if language not in _mapping:  # 判断有没有语言包
        language = _default  # 使用默认语言(英语)
    if msg in _input_temp:
        return _mapping[language][_input_temp[msg]]
    return msg  # 没有找到字典
