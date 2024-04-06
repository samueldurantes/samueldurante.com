---
id: 9faa1f405a3247f3939e7092c358f218
title: Por que os modelos de IA usam GPU em vez de CPU?
description: Uma breve explicação sobre a diferença entre CPU e GPU e porquê os modelos de IA usam GPU em vez de CPU.
createdAt: '2023-07-01'
updatedAt: '2023-08-21'
tags: [programming, ai, hardware, portuguese]
slug: why-ai-models-use-gpu-instead-cpu
---

Há algum tempo, enquanto navegava no [Hacker News](https://news.ycombinator.com/), deparei-me com um post intitulado "WebGPU GPT Model Demo". Isso me fez questionar como o WebGPU se relaciona com modelos de inteligência artificial, e fiz o seguinte comentário no post:

![comment](/assets/why-ai-models-use-gpu-instead-cpu/1.png)

Recentemente, ao revisar meu histórico de comentários no [Hacker News](https://news.ycombinator.com/), deparei-me com essa pergunta novamente. Decidi, então, escrever este post para finalmente formular uma resposta para essa pergunta.

## CPU vs. GPU

Antes de responder à pergunta principal, vamos entender a diferença entre os principais componentes que processam as instruções dos nossos programas: a CPU e a GPU.

### CPU

A CPU (Unidade Central de Processamento) lida principalmente com operações aritméticas em dados individuais. Esses dados individuais são o que chamamos de valores escalares, como números inteiros e booleanos. Eles são denominados valores escalares porque não possuem dimensões ou estruturas complexas.

### GPU

Ao contrário da CPU, a GPU (Unidade de Processamento Gráfico) lida principalmente com operações matemáticas intensivas em estruturas n-dimensionais. Essas estruturas são chamadas de valores vetoriais, como tensores, espaços vetoriais, entre outros.

Embora as CPUs também sejam capazes de lidar com essas operações matemáticas intensivas, seu desempenho não é tão eficiente. Portanto, as GPUs são preferidas para executar esse trabalho, graças à sua arquitetura altamente paralela.

## Por que a GPU em vez da CPU?

As estruturas vetoriais são amplamente utilizadas na formalização de algoritmos de inteligência artificial. Por exemplo, as redes neurais artificiais representam os pesos de cada conexão como elementos de uma matriz, assim como as medidas para recuperação e recomendação de informações são calculadas com base em distâncias entre vetores.

Considerando que a principal representação de dados para modelos de inteligência artificial são estruturas n-dimensionais, as GPUs se tornaram ferramentas comuns nessa área devido à eficiência na realização de operações nessas estruturas, graças à sua capacidade de paralelização massiva.

## Referências

- [[Akitando] #142 - Entendendo COMO ChatGPT Funciona - Rodando sua Própria IA](https://www.akitaonrails.com/2023/06/19/akitando-142-entendendo-como-chatgpt-funciona-rodando-sua-propria-ia)
