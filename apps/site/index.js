// ******************************CALCULAR IDADE*********************************

var campoIdade = document.querySelector('#idade');

function idade(ano_aniversario, mes_aniversario, dia_aniversario) {
    var data = new Date,
        ano_atual = data.getFullYear(),
        mes_atual = data.getMonth() + 1,
        dia_atual = data.getDate(),

        quantos_anos = ano_atual - ano_aniversario;

    if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
        quantos_anos--;
    }

    return quantos_anos;
}

campoIdade.innerHTML = idade(1996, 02, 17)+' anos';

// *****************************************************************************
// *******************************FIXAR NAVBAR**********************************

var offset = $('#navbar').offset().top;
var $navbar = $('#navbar');
var $logoNav = $('#logoNav');
var teste = document.getElementById('logoNav');

if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))) {
    $(document).on('scroll', function () {
        if ((offset) <= $(window).scrollTop()) {
            $navbar.addClass('navbar-fixed');

        } else {
            $navbar.removeClass('navbar-fixed');

        }
    });
} else {
    $navbar.addClass('navbar-fixed');
}
// *****************************************************************************
// ****************************FUNÇÕES DIVERSAS*********************************
//esconder side na versao mobile
function closeMenu(){
    $('.button-collapse').sideNav('hide');
}