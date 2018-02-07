---
layout: post
title: Primeiros passos com Linux
date: 2017-08-02 12:56:20 -0200
description: Iniciante em linux? Confira como escolher uma distribuição e onde aprender sobre este incrível sistema open source! # Add post description (optional)
img: post-1.png # Add image post (optional)
tags: [Blog, Linux, Dicas]
author: Danilo Sambugaro # Add name author (optional)
---

## O que é Linux?
   <p align="justify">
   Linux é o nome dado ao Kernel desenvolvido por <i>Linus Benedict Torvalds</i>, que se baseou no sistema <i>Minix</i> para criar o Linux, se quiser saber mais sobre como o Linux foi criado, recomendo que leia o livro <i>Just For Fun: The Story of an Accidental Revolutionary</i>, de Linus Torvalds (Harper Collins Publishing, 2001).<br />
   O Kernel faz a ligação entre hardware e software, é o coração do sistema operacional, caso você não o conheça há um <a href="https://www.tecmundo.com.br/macos/1636-o-que-e-kernel-.htm" target="\_blank">artigo</a> do Tecmundo com uma explicação básica sobre Kernel.
   </p>
   <p align="justify">
   Os sistemas que usam o Kernel Linux são conhecidos como Distruibuições Linux, assim como Windows ou Mac iOS, uma Distribuição Linux é um sistema operacional que permite a execução de programas e outros dispositivos em um computador, no entanto as Distribuições Linux são <i>Open Source</i>, ou seja, podem ser distribuidas livremente, diferente do Windows e do Mac iOS que são sistemas proprietários.
   </p>

## Escolhendo uma Distribuição Linux
   <p align="justify">
   Existem inúmeras Distribuições Linux, cada uma com suas peculiaridades e espeficicações, devido a este montante de distruições existentes escolher uma delas as cegas pode ser um tanto desafiador. Debian, Ubuntu, Fedora, elementary e outras estão entre as distribuições mais famosas, mas o fato é que dificilmente você saberá qual distribuição melhor se enquadra em seu perfil sem testá-las.
   </p>
   <p align="justify">
   Para ver as distribuições existentes e acompanhar lançamentos de novas versões recomendo o site <a href="http://distrowatch.com/" title="Distro Watch" target="\_blank">distrowatch.com</a>, ele contém várias informações sobre as distribuições Linux, dentre elas: uma breve descrição da distribuição, o site principal, link para download e para documentação, lista das versões, além de manter um ranking das 100 distribuições mais acessadas.
   </p>
   <p align="justify">
   Para quem está começando eu recomento utilizar o <a href="https://elementary.io/" title="elementary OS" target="\_blank">elementary</a>, uma distribuição baseada no Ubuntu e uma das mais bonitas que conheço. O elementary OS é um sistema rápido e leve, um dos primeiros que utilizei, o acho ótimo para aprender o básico do Linux e depois disso começar a explorar as diversas distribuições existentes até encontrar a sua predileta. Apesar desta recomendação fique livre para escolher a distribuição que quiser, embora sistemas como o Arch, que nem sequer possuem um modo gráfico de instalação, são recomendados para usuários mais avançados.
   </p>
   <p align="justify">
   Não mostrarei aqui como realizar a instalação da distribuição linux escolhida, cada uma tem suas peculiaridades e você pode querer fazer um dual boot entre Linux e Windows ou personalizar o particionamento do disco, ou afins. Existem diversos tutoriais na internet que ensinam como realizar a instalção de um sistema Linux, seja sozinho, seja em paralelo com algum outro sistema ou seja em uma máquina virtual.
   </p>

## Conhecendo o Terminal
   <p align="justify">
   Quase tudo, se não tudo, no Linux pode ser feito através do terminal, também chamado de linha de comando ou shell. É importante familiarizar-se com o terminal, você fará muito uso dele.
   </p>
   <p align="justify">
   Vou apresentar aqui alguns atalhos e comandos básicos do terminal.<br />

   Atalhos:<br />
   <kbd>Ctrl + a</kbd> - Move o cursor para o inicio da linha de comando.<br />
   <kbd>Ctrl + e</kbd> - Move o cursor para o fim da linha de comando.<br />
   <kbd>Ctrl + c</kbd> - Para um processo em execução no terminal.<br />
   <kbd>Ctrl + z</kbd> - Suspende um processo em execução no terminal.<br />
   <kbd>Ctrl + d</kbd> - Executa o comando <kbd>exit</kbd>.<br />
   <br />
   Comandos: <br />
   <kbd>fg</kbd> - Retoma, em primeiro plano (foregound), um processo que estava suspenso.<br />
   <kbd>bg</kbd> - Retoma, em segundo plano (backgound), um processo que estava suspenso.<br />
   <kbd>exit</kbd> - Encerra a sessão aberta do terminal.<br />
   <kbd>sudo <i>comando</i></kbd> - Executa um comando como root (Super usuário).<br />
   <kbd>su <i>nome-de-usuário</i> </kbd> - Loga no shell como algum usuário, se nenhum usuário não for esficidado, por padrão, se loga como root.<br />
   <kbd>cd <i>caminho</i></kbd> - Muda o diretório atual para o diretório especificado, use <kbd>cd ..</kbd> para voltar um nivel no diretório.<br />
   <kbd>ls</kbd> - Lista os arquivos e pastas no diretório atual.<br />
   </p>
   <p align="justify">
   Estes comandos e atalhos, muito provavelmente, funcionam em todos terminais linux que vêm nativamente com o sitema. No docorrer de seus estudos sobre Linux com certeza irá se deparar com diversos outros comandos, talvez estes comandos apareçam precedidos de <kbd>$</kbd> ou <kbd>#</kbd> e seria interessante você saber o significado destes símbolos. O <kbd>$</kbd> significa que o comando deve ser executado como um usuário comum enquanto o <kbd>#</kbd> significa que o comando deve ser executado como root, ou seja, o comando deverá ser executado com o uso do <kbd>sudo</kbd> ou com você logado como usuário root no shell.
   </p>
   <p align="justify">
   Sempre tome cuidado ao executar qualquer comando da internet, principalmente como root, eles podem prejudicar seu sistema, procure estudar o comando antes para ter certeza do que ele faz.
   </p>

## Aprendendo a usar o Linux
   <p align="justify">
   Como já comentei, existem inúmeras Distribuições Linux, cada uma tem suas peculiaridades e talvez comandos específicos, mas o básico de um sistema linux, quase sempre, é o mesmo para todos elas. Devido ao linux ser um sistema Open Source, a performace e velocidade em que novos recursos são adicionados ao sistema é muito alta, isso acarreta em várias atualizações para o sistema e seus pacotes (programas/recursos), eu irei explicar aqui como instalar pacotes e manter seu sistema atualizado.
   </p>
   <p align="justify">
   Muitas Distribuições Linux trazem uma ambiente gráfico para lidar com atualização do sistema e de seus pacotes, mas eu sempre preferi realizar esta tarefa no terminal, através de linha de comando e é assim que mostrarei aqui. A instalação e atualização de pacotes e do sitema é feitas através de um gerenciador de pacotes, vou abordar aqui os gerenciadores e comandos das distribuições mais utilizadas, se a sua não entrar neste quadro pesquise os comandos específicos do seu sistema.
   </p>
   <p align="justify">
   Para Fedora e derivados, como centOS e RedHat, o gerenciador é o YUM.<br/>
   Para instalar algum pacote o comando é:
   </p>

   ```
   # yum install <nome do pacote>
   ```
   E para remover um pacote instalado:
   ```
   # yum remove <nome do pacote>
   ```
   O seguinte comando atualiza o sistema e os pacotes:
   ```
   # yum update
   ```

   <p align="justify">
   Para Debian e derivados, como Ubuntu e elementary, o gerenciador é o apt-get.<br/>
   Para instalar algum pacote o comando é:
   </p>

   ```
   # apt-get install <nome do pacote>
   ```
   E para remover um pacote instalado:
   ```
   # apt-get remove <nome do pacote>
   ```
   O seguinte comando atualiza a lista de pacotes e programas que podem ser instalados:
   ```
   # apt-get update
   ```
   E o comando para atualizar o sistema e os pacotes é:
   ```
   # apt-get upgrade
   ```
   <p align="justify">
   </p>

   <p align="justify">
   Para Arch e derivados, como Antergos e Manjaro, o gerenciador é o pacman.<br/>
   Para instalar algum pacote o comando é:
   </p>

   ```
   # pacman -S <nome do pacote>
   ```
   E para remover um pacote instalado:
   ```
   # pacman -R <nome do pacote>
   ```
   E o comando para atualizar o sistema e os pacotes é:
   ```
   # pacman -Syyu
   ```
   <p align="justify">
   Com isso você já deve ser capaz de começar a utilizar seu sistema linux, mas ainda há muito mais para aprender, recomendo o <a href="http://www.guiafoca.org/?page_id=238" target="\_blank">Guia Foca GNU/Linux</a>, que é um guia que traz desde explicações básicas do sistema Linux até a administração e segurança. Se quiser se tornar um especialista recomendo ainda o livro <i>Linux, a Bíblia</i> (ALTA BOOKS, 2014).
   </p>
   <p align="justify">
   Nunca deixe de ler a documentação do sistema que está utilizando e se mantenha ativo na comunidade Linux, tirando suas dúvidas, sanando as de outros e participando de discuções. <a href="https://www.vivaolinux.com.br/" target="\_blank">Viva o Linux</a> é umas das maiores comunidades Linux da América Latina, vale dar uma olhada no site deles.
   </p>
   <p align="justify">
   Boa sorte nos seus estudos e bem vindo ao Linux.!
   </p>
