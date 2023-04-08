---
id: ae1631080053148e353fabf7053dbcc7
title: Uma Breve Introdução aos Sistemas F e Fω
created_at: '2023-04-08'
tags: [programming, type-theory]
slug: a-short-introduction-to-systems-f-and-f-omega
---

> This post is an incomplete translation of the article ["A Short Introduction to Systems F and Fω"](https://web.archive.org/web/20210704051919if_/https://babel.ls.fi.upm.es/~pablo/Papers/Notes/f-fw.pdf).

> If there are any issues with referencing, please [contact me via email](mailto:samueldurante.h@gmail.com)

## 1. Introdução

Essas notas contém uma breve introdução aos aspectos sintáticos, contexto-dependentes e
operacionais do System F e System Fω. O primeiro extende o
_Simply Typed Lambda Calculus_ com polimorfismo paramétrico. O segundo extende o primeiro
com operadores de tipo. As referências a seguir contêm apresentações detalhadas dos
sistemas e dos _Lambda Calculi_ tipados em geral: [Car97, CW85, Pie02, Mit96]

## 2. Preliminares

**O que é o _Lambda Calculus?_** Nós podemos descrever o Lambda Calculus
[Chu41, Mit96, Bar84] com uma pequena linguagem de programação de funções anônimas de primeira classe. Foi originalmente concebido como uma linguagem formal
(ou seja, simbólica) de funções não tipadas que faziam parte de um sistema de provas de
igualdade funcional. A parte lógica do sistema foi provada inconsistente, mas a linguagem
de funções foi considerada útil e deu origem a diferentes famílias de linguagens que modelam diferentes aspectos da computação. Extensões tipadas com polimorfismo, recursão,
primitivos _built-in_, mais facilidades de nomenclatura e definição em nível de tipo e
valor que compõem o _core_ das linguagens funcionais [Lan66, Pie02, Rea89]. Melhorias nos
aspectos operacionais no _core_ da linguagem formam a base de implementações de linguagem
funcional.

**_Object e meta language_.** Nós assumimos familiaridade com a distinção entre
**_object language_**, uma linguagem formal particular em estudo, e **meta-language**,
a notação usada quando falamos sobre o _object language_.

**Definições e equalidade.** É uma prática comum na matemática o uso da equalidade como um
dispositivo de definição. Como a igualdade também é usada como uma relação em entidades já
definidas, distinguimos igualdade da igualdade de definição e usamos the símbolo `def =` para o
segundo. Uma definição induz uma equalidade no sentido que se `X def = Y` then `X = Y`; o
inverso não precisa ser verdadeiro.

**Formato das regras de tipos.** Regras de tipos são escritas indutivamente no estilo de dedução
natural:

![](https://media.discordapp.net/attachments/998750998979940463/1069105672337231902/image.png)

onde n ≥ 0. Regras podem ser lidas para a frente (quando todos os antecedentes são o caso, então todos os consequentes
são o caso) ou para tras (todos os consequentes são o caso se todos os antecedentes são o caso). Variáveis aparecendo em antecedentes e consequentes são assumidos como universalmente quantificadas a não ser que seja indicado de outra forma.

**Convenções Gramaticais.** Nós usamos a notação EBNF para definir a sintaxe. Não terminais são escritos em letras maiusculas _slanted_. Qualquer outro símbolo representa um terminal com exceção dos meta-operadores posfixos ?, + e _. Seus significados são os seguintes: X?, X_, X+ denotam, respectivamente, zero ou um X, zero ou mais X, e um ou mais X, onde X pode ser um terminal ou não terminal. Parenteses também são usados como meta-notação para agrupar, por exemplo, (X Y)\*.

O exemplo EBNF seguinte é um _snippet_ da gramática do C++ [STR92]:

```haskell
CondOp ::= if Cond Block (else Block)?

Cond ::= ( Expression )

Block ::= Stmt | { Stmt+ }
```

Na primeira produção parenteses são meta-notação. Na segunda, eles são _object-level symbols_, pois não são seguidos por um meta-operador posfixo.

**Quantificação.** Nós seguimos a amplamente utilizada e bem conhecida _“quantifier-dot” convention_ para denotar quantificação. Por exemplo, in ∀x.P o escopo da variável ligada x vai do ponto até o fim da expressão P. Além disso,

∀x ∈ S. P abrevia ∀x. x ∈ S ⇒ P

## 3. Lambda Caulculus Simplesmente Tipado Puro

![image](https://user-images.githubusercontent.com/68401005/216840527-357065c1-0592-4fe0-b097-ba3f94f8acfa.png)

A figura 1 mostra a sintaxe, regras de tipo e semantica operacional o Lambda Calculus SImplesmente Tipado Puro (PSTLC). Existem termos carregando anotações de tipo e por isso é chamado "explicitamente tipados" - ou, á la Church, quem primeiro propôs isso [HS86]. Os paragrafos seguintes elaboram.

**Termos e Tipos.** O PSTLC tem uma linguagem de tipos (Tipos não terminais) para expressar os tipos de funções indutivamente _from a unique base or gound type \*_, e uma linguagem de termos (Term não terminal) que consiste em variáveis, abstrações lambda (funções anonimas), e aplicações de termos a outros termos. Variáveis representam os parametros formais ou valores primitivos ainda a ser definidos quando não vinculados a nenhum λ. Em uma abstração lambda λx: τ.t, o símbolo λ indica que x é uma variável ligada - ou seja, um parametro formal -, τ é o tipo do x, e t abrevia uma expressão onde x talvez ocorra livre. a tabela 2 contém a lista de convenções de meta-variáveis seguindas nessas notas.

![image](https://user-images.githubusercontent.com/68401005/216840532-eba1bdf5-4748-4c49-ac8c-70bcfd8c5507.png)

Tipos e termos são separados com a única exceção que tipos podem aparecer como anotações em abstrações lambda. O tipo de uma função é tambem chamado de sua **assinatura de tipo**. Ele descreve a aridade e a ordem da função e os tipos dos seus argumentos. A **aridade** é o número de argumentos que a função recebe. A **ordem** é determinada pela assinatura de tipo da seguinte forma:

![image](https://user-images.githubusercontent.com/68401005/216840539-6466aeba-5072-4526-ac66-3a06827d7f23.png)

Seja τ o tipo de uma abstração lambda e suponha ordem(τ) = n. Se n = 1 então a abstração lambda talvez retorne um _manifest (non function)_ valor de tipo \* ou outra expressão lambda de ordem 1 como resultado. Se n > 1, então ela é uma abstração de ordem superior que ou recebe ou retorna uma abstração lambda de ordem n.

É comum _blur_ a distinção conceitual entre _manifest values_ e _function values_ considerando a primeira como _nullary functions_ e a segunda como _proper functions_.

A _fixity_ de uma função é um conceito independente. Ele determina a denotação sintática do aplicação da função aos seus argumentos. Em algumas linguagemns funcionais, funções podem ser infixas, prefixas, posfixas, mixfixas, e têm suas precedências e associatividade definidas por programadores. No PSTLC, abstrações lambda são prefixas, aplicação associa à esquerda - por exemplo t1 t2 t3 é parseado como (t1 t2) t3 - e consequentemente setas em assinaturas de tipo associam à direita - por exemplo, ∗ → ∗ → ∗ é parseado como ∗ → (∗ → ∗).

Funções de multiplos argumentos são representadas como funções de ordem superior currificadas que recebem um argumento mas retornam outra função como resultado. Por exemplo o termo:

λx:∗ . λy :∗ → ∗ . y x

é uma função de ordem superior que recebe um _manifest value x_ e retorna uma função que recebe uma função y como argumento e a aplica a x.

INCOMPLETE...

## Bibliografia

[Bar84] Henk P. Barendregt. The Lambda Calculus: Its Syntax and Semantics. North Holland,
Amsterdam, revised edition, 1984.

[Blo91] Stephen Blott. Type Classes. PhD thesis, Glasgow University, Glasgow, Scotland, UK, 1991.

[Car97] Luca Cardelli. Type systems. In Allen B. Tucker, editor, The Computer Science and
Engineering Handbook. CRC Press, Boca Raton, FL, 1997. Revised 2004.

[Chu41] Alonzo Church. The Calculi of Lambda Conversion. Princeton University Press, 1941.

[CW85] Luca Cardelli and Peter Wegner. On understanding types, data abstraction, and polymorphism. Computer Surveys, 17(4):471–522, December 1985.

[Gir72] Girard, J.-Y. Interprétation Fonctionnelle et Élimination des Coupures de l'Arithmétique d'Ordre Supérieur. Thèse de doctorat d'État, Université Paris.

[HS86] J. Roger Hindley and Jonathan P. Seldin. Introduction to Combinators and λ-Calculus.
London Mathematical Society, Student Texts 1. Cambridge University Press, 1986. Reprint 1993.

[Jon92] Mark P. Jones. Qualified Types: Theory and Practice. PhD thesis, Oxford University,
July 1992.

[Lan66] Peter J. Landin. The next 700 programming languages. Communications of the ACM,
9(3):157–164, March 1966. Originally presented at the Proceedings of the ACM Programming Language and Pragmatics Conference, August 8–12, 1965.

[Mit96] John C. Mitchell. Foundations for Programming Languages. MIT Press, 1996.

[Pie02] Benjamin C. Pierce. Types and Programming Languages. The MIT Press, 2002.

[Rea89] Chris Reade. Elements of Functional Programming. International Series in Computer
Science. Addison-Wesley, 1989.

[Rey74] John C. Reynolds. Towards a theory of type structure. In Programming Symposium,
Proceedings Colloque sur la Programmation, pages 408–423. Springer-Verlag, 1974.

[Sto77] Joseph E. Stoy. Denotational Semantics: The Scott-Strachey Approach to Programming
Language Semantics. MIT Press, Cambridge, Massachusetts, 1977.

[Str92] Bjarne Stroustrup. The C++ Programming Language. Addison Wesley, 2nd edition, 1992.

[WB89] Philip Wadler and Stephen Blott. How to make ad-hoc polymorphism less ad hoc. In 16th
ACM Symposium on Principles of Programming Languages, pages 60–76, 1989.
