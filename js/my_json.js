var INT = 1;
var TEXT = 2;
var TEXTAREA = 3;

$(document).ready(function () {
    var url='http://account.rainmsg.com/json_admingetdb.php?table=test&page=1';
    datasgLoad(url);

    //添加按钮点击事件
    $('#add-button').on('click', function () {
        $('#dialog-bg').show();
        $('#dialog-title').attr('value', 'add');
        $('#dialog-form p input[name = "id"]').val('');
        $('#dialog-form p input[name = "name"]').val('');
        $('#dialog-form p input[name = "phone"]').val('');
        $('#dialog-form p select[name = "sex"]').val('男');
        $('#dialog-form p input[name = "old"]').val('');
        $('#dialog-form p textarea').val('');
        $('#dialog-title').text($(this).text());
        $('#dialog-form p input[name = "id"]').parent().hide();
        $('#dialog').show();
    });

    //编辑按钮点击事件
    $('#edit-button').on('click', function () {
        var all_checkbox = $('#table-body tr td input[type = "checkbox"]');
        var edit_checkbox = null;
        var checked_num = 0;
        $.each(all_checkbox, function (checkbox_index, checkbox_value) {
            if ($(checkbox_value).prop('checked')) {
                checked_num++;
                if (checked_num == 1) {
                    edit_checkbox = $(checkbox_value).parent().parent();
                }
            }
        });
        switch (checked_num) {
            case 0:
                alert('请选择一条需要编辑的记录');
                break;
            case 1:
                $('#dialog-bg').show();
                $('#dialog-form p input[name = "id"]').val(edit_checkbox.find('td[name="id"]').text());
                $('#dialog-form p input[name = "id"]').parent().show();
                $('#dialog-form p input[name = "name"]').val(edit_checkbox.find('td[name="name"]').text());
                $('#dialog-form p input[name = "phone"]').val(edit_checkbox.find('td[name="phone"]').text());
                $('#dialog-form p select[name = "sex"]').val(edit_checkbox.find('td[name="sex"]').text());
                $('#dialog-form p input[name = "old"]').val(edit_checkbox.find('td[name="old"]').text());
                $('#dialog-form p textarea').val(edit_checkbox.find('td[name="about"]').text());
                $('#dialog-title').text($(this).text());
                $('#dialog-title').attr('value', 'edit');
                $('#dialog').show();
                break;
            default:
                alert('只能同时编辑一条记录,请重新选择!');
                break;
        }
    });

    var del_checkboxs = [];
    //删除按钮点击事件
    $('#delete-button').on('click', function () {
        var all_checkbox = $('#table-body tr td input[type = "checkbox"]');
        var checked_num = 0;
        $.each(all_checkbox, function (checkbox_index, checkbox_value) {
            if ($(checkbox_value).prop('checked')) {
                del_checkboxs[checked_num] = $(checkbox_value).parent().parent().find('td[name="id"]').text();
                checked_num++;
            }
        });
        if (checked_num != 0) {
            $('#dialog-bg').show();
            $('#dialog-form').hide();
            $('#dialog-form').after($('<p>确认删除?</p>'));
            $('#dialog-form').next().addClass('form-style');
            $('#dialog-title').text($(this).text());
            $('#dialog-title').attr('value', 'delete');
            $('#dialog').show();
        } else {
            alert('请选择需要删除的选项!');
        }

    });

    //提交按钮点击事件
    $('#submit-button').on('click', function () {
        var input_datas = $('#dialog-form p input');
        var action_name = $('#dialog-title').attr('value');
            switch (action_name) {
                case 'add':
                    checkNull(input_datas);
                    url = 'http://account.rainmsg.com/json_admingetdb.php?table=test&page=1&action=add&key=&name=' +
                        $('#dialog-form p input[name="name"]').val() + '&phone=' +
                        $('#dialog-form p input[name="phone"]').val() + '&sex=' +
                        $('#dialog-form p select').find('option:selected').text() +
                        '&old=' + $('#dialog-form p input[name="old"]').val() +
                        '&about=' + $('#dialog-form p textarea').val();
                    break;
                case 'edit':
                    checkNull(input_datas);
                    url = 'http://account.rainmsg.com/json_admingetdb.php?table=test&page=1&action=edit&key=&id=' +
                        $('#dialog-form p input[name="id"]').val() + '&name=' +
                        $('#dialog-form p input[name="name"]').val() + '&phone=' +
                        $('#dialog-form p input[name="phone"]').val() + '&sex=' +
                        $('#dialog-form p select').find('option:selected').text() +
                        '&old=' + $('#dialog-form p input[name="old"]').val() +
                        '&about=' + $('#dialog-form p textarea').val();
                    break;
                case 'delete':
                    url = 'http://account.rainmsg.com/json_admingetdb.php?table=test&page=1&action=delsome&key=&ids=' +
                        del_checkboxs.join(',');
                    $('#dialog-form').next().remove();
                default:
                    break;
            }
        console.log(url);
        datasgLoad(url);
        $('#dialog-bg').hide();
        $('#dialog').hide();
    });

    //取消按钮点击事件
    $('#cancel-button').on('click', function () {
        console.log($('#page-select option:selected'));
        if ($('#dialog-title').attr('value') == 'delete') {
            $('#dialog-form').show();
            $('#dialog-form').next().remove();
        }
        $('#dialog-bg').hide();
        $('#dialog').hide();
    })

    //翻页按钮点击事件
    $('#page-select').on('change', function () {
        url='http://account.rainmsg.com/json_admingetdb.php?table=test&page=' + $(this).val();
        datasgLoad(url);
    })
});

//加载页面数据
function datasgLoad(url) {
    console.log(url);
    $('#table-head').empty();
    $('#table-body').empty();
    $('#page-select').empty();
    var page_select;
    $.ajax({
        type: 'get',
        url: url,
        dataType: 'jsonp',
        jsonp:'callback',
        jsonpCallback:'success_jsonpCallback',
        success:function(json){
            $.each(json, function (index, row_data) {
                if (index == 0) {
                    $.each(row_data, function (index, header_data) {
                        switch (index) {
                            case 'Field':
                                tableHeadAndDialogElementAdd(header_data);
                                break;
                            case 'table':
                                break;
                            case 'action':
                                break;
                            case 'Pagenum':
                                $('#total-page').text(header_data);
                                for (var i = 0; i < header_data; i++){
                                    $('#page-select').append('<option value="' + (i + 1) +'">' + (i + 1) + '</option>');
                                }
                                break;
                            case 'Page':
                                page_select = header_data;
                                break;
                            default:
                                break;
                        }
                    });
                } else {
                    tableBodyElementAdd(row_data);
                }
                $('#page-select').val(page_select);
            });
            th_hide_fun();
        },
        error:function(XMLHttpRequest, testStatus, errorThrown){
            console.log(errorThrown);
        }
    });
}

var table_head = [];
var th_hide = [0];
//给表格添加表头以及弹出框内容的函数
function tableHeadAndDialogElementAdd(arr) {
    $('#dialog-form').empty();
    var $_thead_ele = $('<tr></tr>');
    var $_is_select = false;
    $.each(arr, function (index, ele_property_obj) {
        var $_ele_property =  $('<th></th>');
        var $_dialog_text_ele = $('<p></p>');
        var $_dialog_input_ele = $('<input/>');
        var $_input_info = $('<i></i>');
        var $_dialog_select_ele = $('<select></select>');
        $.each(ele_property_obj, function (ele_property_name, ele_property_value) {
            switch (ele_property_name) {
                case 'Field':
                    $_ele_property.attr('name', ele_property_value);
                    $_dialog_input_ele.attr('name', ele_property_value);
                    $_dialog_select_ele.attr('name', ele_property_value);
                    table_head[index] = ele_property_value;
                    break;
                case 'Title':
                    $_ele_property.text(ele_property_value);
                    $_dialog_text_ele.text(ele_property_value + ': ');
                    break;
                case 'hide':
                    if (ele_property_value == 1)    {$_ele_property.hide();}
                    th_hide[index + 1] = ele_property_value;
                    break;
                case 'select':
                    if (ele_property_value == 1) {$_is_select = true;}
                    break;
                case 'type':
                    if (ele_property_value == 'int') {
                        $_dialog_input_ele = dataTypeLimit(INT, $_dialog_input_ele);
                    } else if (ele_property_value == 'text') {
                        $_dialog_input_ele = dataTypeLimit(TEXT, $_dialog_input_ele);
                    } else {
                        $_dialog_input_ele = dataTypeLimit(TEXTAREA, $_dialog_input_ele);
                    }
                    break;
                case 'info':
                    $_input_info.text(ele_property_value);
                    break;
                case 'readonly':
                    if (ele_property_value == 1) {
                        $_dialog_input_ele.prop('readonly', 'readonly');
                        $_dialog_text_ele.hide();
                    }
                    break;
                case 'item':
                    $.each(ele_property_value, function (select_index, select_value) {
                        var $_option = $('<option></option>');
                        $_option.attr('name', select_value['name']);
                        $_option.attr('value', select_value['value']);
                        $_option.text(select_value['value']);
                        $_dialog_select_ele.append($_option);
                    });
                    break;
                default:
                    break;
            }
            $_thead_ele.append($_ele_property);
        });
        if ($_is_select) {
            $_dialog_text_ele.append($_dialog_select_ele);
        } else {
            $_dialog_text_ele.append($_dialog_input_ele);
            $_dialog_text_ele.append($_input_info);
        }
        $_is_select = false;
        $('#dialog-form').append($_dialog_text_ele);
    });
    var $_check_all = $('<th class="table-checkbox"><input id="select-all" type="checkbox">全选</th>');
    $_check_all.on('click', selectAll);
    $_thead_ele.prepend($_check_all);
    $('#table-head').append($_thead_ele);
}

//给表格添加行元素的函数
function tableBodyElementAdd(tbody_ele) {
    var $_tbody_ele = $('<tr></tr>');
    $.each(table_head, function (head_index, head_value) {
        $.each(tbody_ele, function (body_index, body_value) {
            if (head_value == body_index) {
                var $_th_value =  $('<td name=' + head_value + '>' + body_value +'</td>');
                $_tbody_ele.append($_th_value);
            }
        })
    });
    $_tbody_ele.prepend('<td class="table-checkbox" align="center"><input type="checkbox"></td>');
    $_tbody_ele.on('click', tr_click_fun);
    $("#table-body").append($_tbody_ele);
}

//隐藏列的函数
function th_hide_fun() {
    $.each(th_hide, function (index, value) {
        if (value == 1) {
            var table_len = $('#my-table tr').length;
            for (var i = 0; i < table_len; i++) {
                $('#my-table tr').eq(i).find('td').eq(index).hide();
            }
        }
    })
}

//给行元素添加点击事件
function tr_click_fun(){
    if ($(this).find('td:first-child').find('input').prop('checked')) {
        $(this).find('td:first-child').find('input').prop('checked', false);
        $(this).removeClass('tr-selected');
    } else {
        $(this).find('td:first-child').find('input').prop('checked', true);
        $(this).addClass('tr-selected');
    }
}

//选择全部
function selectAll() {
    var a = $('#table-body').find('input');
    if ($(this).find('input').prop('checked')){
        $.each(a, function (index, value) {
            $(value).prop("checked", true);
            $(value).parent().parent('tr').addClass('tr-selected');
        })
    } else {
        $.each(a, function (index, value) {
            $(value).prop("checked", false);
            $(value).parent().parent('tr').removeClass('tr-selected');
        })
    }
}

//限制input的输入数据的类型
function dataTypeLimit(type, ele) {
    switch (type) {
        case 1:
            ele.bind('keyup', function (key, value) {
                var obj = $(this);
                obj.val(obj.val().replace(/[^\d]*/g, ''));
            });
            break;
        case 2:
            ele.attr('type', 'text');
            break;
        case 3:
            ele = $('<textarea></textarea>');
            break;
        default:
            break;
    }
    return ele;
}

//检查输入框是否有未填项
function checkNull(input_text) {
    var num=0;
    var str="";
    input_text.each(function(n){
        if($(this).attr('name') == "name" && $(this).val()=="")
        {
            num++;
            str+='名字'+'不能为空！\r\n';
        } else if($(this).attr('name') == "phone" && $(this).val()=="")
        {
            num++;
            str+='电话'+'不能为空！\r\n';
        }else if($(this).attr('name') == "old" && $(this).val()=="")
        {
            num++;
            str+='年龄'+'不能为空！\r\n';
        }
    });
    if(num>0)
    {
        alert(str);
        return false;
    }
    else
    {
        return true;
    }
}