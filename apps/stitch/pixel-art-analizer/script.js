        // Script para mostrar opções de alternância quando selecionado
        document.getElementById('readingDirection').addEventListener('change', function() {
            const alternatingOptions = document.getElementById('alternatingOptions');
            if (this.value === 'alternating') {
                alternatingOptions.style.display = 'block';
            } else {
                alternatingOptions.style.display = 'none';
            }
        });
        
        // Correção para o modal de corte
        document.addEventListener('DOMContentLoaded', function() {
            // Elementos DOM para o modal de corte
            const imageInput = document.getElementById('imageInput');
            const cropModal = document.getElementById('cropModal');
            const cropModalInstance = new bootstrap.Modal(cropModal);
            const cropImage = document.getElementById('cropImage');
            const closeCropModal = document.getElementById('closeCropModal');
            const applyCropBtn = document.getElementById('applyCrop');
            const cancelCropBtn = document.getElementById('cancelCrop');
            
            // Substituir o evento de upload de imagem
            imageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        // Configurar a imagem no modal de corte
                        cropImage.src = event.target.result;
                        
                        // Mostrar o modal usando a API do Bootstrap
                        cropModalInstance.show();
                        
                        // Inicializar o cropper após a imagem carregar
                        cropImage.onload = () => {
                            if (cropper) {
                                cropper.destroy();
                            }
                            
                            cropper = new Cropper(cropImage, {
                                viewMode: 1,
                                aspectRatio: NaN, // Permitir qualquer proporção
                                autoCropArea: 1, // Selecionar 100% da imagem por padrão
                                initialAspectRatio: NaN,
                                cropBoxMovable: true,
                                cropBoxResizable: true,
                                dragMode: 'move',
                                zoomable: true,
                                scalable: true,
                                guides: true,
                                background: true,
                                responsive: true,
                                ready: function() {
                                    // Definir a área de corte para cobrir toda a imagem
                                    const canvasData = cropper.getCanvasData();
                                    cropper.setCropBoxData({
                                        left: 0,
                                        top: 0,
                                        width: canvasData.width,
                                        height: canvasData.height
                                    });
                                }
                            });
                        };
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            // Eventos para fechar o modal
            closeCropModal.addEventListener('click', () => {
                cropModalInstance.hide();
                imageInput.value = '';  // Limpar a seleção de arquivo
            });
            
            cancelCropBtn.addEventListener('click', () => {
                cropModalInstance.hide();
                imageInput.value = '';  // Limpar a seleção de arquivo
            });
            
            // Aplicar o corte
            applyCropBtn.addEventListener('click', () => {
                if (!cropper) return;
                
                // Obter o canvas com a imagem cortada
                const canvas = cropper.getCroppedCanvas({
                    imageSmoothingEnabled: false,  // Manter pixels nítidos
                    imageSmoothingQuality: 'high'
                });
                
                if (canvas) {
                    // Criar uma nova imagem com a área cortada
                    image = new Image();
                    image.onload = () => {
                        // Redimensionar o canvas para o tamanho da imagem cortada
                        const displayCanvas = document.getElementById('canvas');
                        displayCanvas.width = image.width;
                        displayCanvas.height = image.height;
                        const ctx = displayCanvas.getContext('2d');
                        ctx.drawImage(image, 0, 0);
                    };
                    image.src = canvas.toDataURL();
                    
                    // Fechar o modal usando a API do Bootstrap
                    cropModalInstance.hide();
                }
            });
            
            // Verifica o valor inicial do select e mostra as opções relevantes
            const readingDirection = document.getElementById('readingDirection');
            const alternatingOptions = document.getElementById('alternatingOptions');
            if (readingDirection.value === 'alternating') {
                alternatingOptions.style.display = 'block';
            }
        });
        
        // Sobrescrever a função displayResults para aplicar as classes corretas
        const originalDisplayResults = window.displayResults;
        window.displayResults = function(result, gridSize, columnsCount, backgroundColor, ignoreBackground, groupColors, showHexColors) {
            // Chamar a função original
            originalDisplayResults(result, gridSize, columnsCount, backgroundColor, ignoreBackground, groupColors, showHexColors);
            
            // Adicionar classes à tabela
            const tables = document.querySelectorAll('#resultsContent table');
            if (tables.length > 0) {
                const table = tables[0];
                table.classList.add('table', 'table-results', 'table-bordered');
            }
        };
        
// Cores nomeadas expandidas
const colorNames = {
    // Cores básicas
    '#000000': 'Preto',
    '#FFFFFF': 'Branco',
    '#FF0000': 'Vermelho',
    '#00FF00': 'Verde',
    '#0000FF': 'Azul',
    '#FFFF00': 'Amarelo',
    '#00FFFF': 'Ciano',
    '#FF00FF': 'Magenta',
    
    // Tons de roxo
    '#800080': 'Roxo',
    '#9370DB': 'Roxo-médio',
    '#9932CC': 'Roxo-orquídea',
    '#8A2BE2': 'Roxo-violeta',
    '#4B0082': 'Índigo',
    '#663399': 'Rebecca-roxo',
    '#6A5ACD': 'Azul-ardósia',
    '#483D8B': 'Azul-ardósia-escuro',
    '#7B68EE': 'Azul-ardósia-médio',
    
    // Tons de rosa
    '#FFC0CB': 'Rosa',
    '#FF69B4': 'Rosa-quente',
    '#FF1493': 'Rosa-profundo',
    '#C71585': 'Violeta-médio',
    '#DB7093': 'Violeta-pálido',
    
    // Tons de vermelho
    '#DC143C': 'Carmesim',
    '#B22222': 'Tijolo',
    '#8B0000': 'Vermelho-escuro',
    '#A52A2A': 'Marrom',
    '#CD5C5C': 'Vermelho-indiano',
    
    // Tons de laranja
    '#FFA500': 'Laranja',
    '#FF8C00': 'Laranja-escuro',
    '#FF4500': 'Laranja-avermelhado',
    '#FF7F50': 'Coral',
    
    // Tons de amarelo
    '#FFD700': 'Dourado',
    '#FFFFE0': 'Amarelo-claro',
    '#F0E68C': 'Caqui',
    '#BDB76B': 'Caqui-escuro',
    
    // Tons de verde
    '#32CD32': 'Verde-limão',
    '#00FF7F': 'Verde-primavera',
    '#2E8B57': 'Verde-mar',
    '#3CB371': 'Verde-mar-médio',
    '#006400': 'Verde-escuro',
    '#9ACD32': 'Amarelo-verde',
    '#6B8E23': 'Verde-oliva',
    '#808000': 'Oliva',
    
    // Tons de azul
    '#87CEEB': 'Azul-céu',
    '#00BFFF': 'Azul-céu-profundo',
    '#1E90FF': 'Azul-dodger',
    '#4682B4': 'Azul-aço',
    '#5F9EA0': 'Azul-cadete',
    '#7FFFD4': 'Água-marinha',
    '#40E0D0': 'Turquesa',
    '#48D1CC': 'Turquesa-médio',
    '#00CED1': 'Turquesa-escuro',
    '#20B2AA': 'Verde-mar-claro',
    '#008B8B': 'Ciano-escuro',
    '#008080': 'Verde-azulado',
    '#000080': 'Azul-marinho',
    '#0000CD': 'Azul-médio',
    '#191970': 'Azul-meia-noite',
    
    // Tons de marrom
    '#8B4513': 'Marrom-sela',
    '#A0522D': 'Siena',
    '#D2691E': 'Chocolate',
    '#CD853F': 'Peru',
    '#DEB887': 'Madeira',
    '#F4A460': 'Areia-marrom',
    
    // Tons de cinza
    '#808080': 'Cinza',
    '#A9A9A9': 'Cinza-escuro',
    '#D3D3D3': 'Cinza-claro',
    '#778899': 'Cinza-ardósia-claro',
    '#708090': 'Cinza-ardósia',
    '#2F4F4F': 'Cinza-ardósia-escuro',
    
    // Cores diversas
    '#FF9999': 'Rosa-claro',
    '#FFCC99': 'Pêssego',
    '#FFFF99': 'Amarelo-pálido',
    '#CCFF99': 'Verde-pálido',
    '#99FFFF': 'Azul-pálido',
    '#CC99FF': 'Lavanda-pálida'
};

// Função melhorada para agrupar cores semelhantes
function getColorNameGrouped(r, g, b) {
    const hex = chroma(r, g, b).hex().toUpperCase();
    
    // Limiar para considerar cores como "iguais"
    const similarityThreshold = 15; // Ajuste este valor conforme necessário
    
    // Encontrar a cor mais próxima e agrupar cores semelhantes
    let bestMatch = { name: 'Desconhecida', distance: Infinity, hex: hex };
    let similarColors = [];
    
    for (const [colorHex, colorName] of Object.entries(colorNames)) {
        const distance = chroma.distance(hex, colorHex);
        
        // Se a distância for muito pequena, considere a mesma cor
        if (distance < similarityThreshold) {
            similarColors.push({ name: colorName, distance, hex: colorHex });
        }
        
        if (distance < bestMatch.distance) {
            bestMatch = { name: colorName, distance, hex: colorHex };
        }
    }
    
    // Se encontrarmos cores semelhantes, use aquela com o nome mais comum
    if (similarColors.length > 0) {
        // Agrupar por nome de cor
        const nameGroups = {};
        for (const color of similarColors) {
            nameGroups[color.name] = nameGroups[color.name] || [];
            nameGroups[color.name].push(color);
        }
        
        // Encontrar o nome mais comum
        let mostCommonName = bestMatch.name;
        let maxCount = 0;
        
        for (const [name, colors] of Object.entries(nameGroups)) {
            if (colors.length > maxCount) {
                maxCount = colors.length;
                mostCommonName = name;
            }
        }
        
        return mostCommonName;
    }
    
    // Se a distância for muito grande, usar uma descrição baseada em HSL
    if (bestMatch.distance > 50) {
        const [h, s, l] = chroma(hex).hsl();
        
        // Matiz
        let hueDesc = '';
        if (h === undefined) {
            hueDesc = (l < 50) ? 'Preto' : (l > 90) ? 'Branco' : 'Cinza';
        } else if (h < 30) hueDesc = 'Vermelho';
        else if (h < 60) hueDesc = 'Laranja';
        else if (h < 90) hueDesc = 'Amarelo';
        else if (h < 150) hueDesc = 'Verde';
        else if (h < 210) hueDesc = 'Ciano';
        else if (h < 270) hueDesc = 'Azul';
        else if (h < 330) hueDesc = 'Roxo';
        else hueDesc = 'Vermelho';
        
        // Luminosidade
        let lightDesc = '';
        if (l < 25) lightDesc = 'escuro';
        else if (l > 75) lightDesc = 'claro';
        
        // Saturação
        let satDesc = '';
        if (s < 0.25) satDesc = 'acinzentado';
        else if (s > 0.75) satDesc = 'vivo';
        
        // Combinar descrições
        let desc = hueDesc;
        if (lightDesc) desc += '-' + lightDesc;
        if (satDesc) desc += ' ' + satDesc;
        
        return desc;
    }
    
    return bestMatch.name;
}

// Substituir a função getColorName pela nova versão
const getColorName = getColorNameGrouped;

const imageInput = document.getElementById('imageInput');
const gridColumnsInput = document.getElementById('gridColumns');
const backgroundColorInput = document.getElementById('backgroundColor');
const ignoreBackgroundCheck = document.getElementById('ignoreBackground');
const groupColorsCheck = document.getElementById('groupColors');
const showHexColorsCheck = document.getElementById('showHexColors');
const analyzeBtn = document.getElementById('analyzeBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resultsContent = document.getElementById('resultsContent');

let image = null;
let cropper = null;
const cropModal = document.getElementById('cropModal');
const cropImage = document.getElementById('cropImage');
const closeCropModal = document.getElementById('closeCropModal');
const applyCropBtn = document.getElementById('applyCrop');
const cancelCropBtn = document.getElementById('cancelCrop');

// Modificar o evento de upload de imagem e a inicialização do cropper
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            // Configurar a imagem no modal de corte
            cropImage.src = event.target.result;
            
            // Mostrar o modal
            cropModal.style.display = 'block';
            
            // Inicializar o cropper após a imagem carregar
            cropImage.onload = () => {
                if (cropper) {
                    cropper.destroy();
                }
                
                cropper = new Cropper(cropImage, {
                    viewMode: 1,
                    aspectRatio: NaN, // Permitir qualquer proporção
                    autoCropArea: 1, // Selecionar 100% da imagem por padrão
                    initialAspectRatio: NaN,
                    cropBoxMovable: true,
                    cropBoxResizable: true,
                    dragMode: 'move',
                    zoomable: true,
                    scalable: true,
                    guides: true,
                    background: true,
                    responsive: true,
                    ready: function() {
                        // Definir a área de corte para cobrir toda a imagem
                        const canvasData = cropper.getCanvasData();
                        cropper.setCropBoxData({
                            left: 0,
                            top: 0,
                            width: canvasData.width,
                            height: canvasData.height
                        });
                    }
                });
            };
        };
        reader.readAsDataURL(file);
    }
});

// Eventos para fechar o modal
closeCropModal.addEventListener('click', () => {
    cropModal.style.display = 'none';
    imageInput.value = '';  // Limpar a seleção de arquivo
});

cancelCropBtn.addEventListener('click', () => {
    cropModal.style.display = 'none';
    imageInput.value = '';  // Limpar a seleção de arquivo
});

// Aplicar o corte
applyCropBtn.addEventListener('click', () => {
    if (!cropper) return;
    
    // Obter o canvas com a imagem cortada
    const canvas = cropper.getCroppedCanvas({
        imageSmoothingEnabled: false,  // Manter pixels nítidos
        imageSmoothingQuality: 'high'
    });
    
    if (canvas) {
        // Criar uma nova imagem com a área cortada
        image = new Image();
        image.onload = () => {
            // Redimensionar o canvas para o tamanho da imagem cortada
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        };
        image.src = canvas.toDataURL();
        
        // Atualizar o canvas de visualização
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.canvas.width = canvas.width;
        ctx.canvas.height = canvas.height;
        ctx.drawImage(canvas, 0, 0);
        
        // Fechar o modal
        cropModal.style.display = 'none';
    }
});

// Função para analisar a imagem
analyzeBtn.addEventListener('click', () => {
    if (!image) {
        alert('Por favor, selecione uma imagem primeiro!');
        return;
    }
    
    // Obter a quantidade de quadrados por linha
    let gridColumns = parseInt(gridColumnsInput.value);
    let gridSize;
    
    // Se gridColumns for 0, tentar detectar automaticamente
    if (gridColumns === 0) {
        // Pegar a cor de fundo para ajudar na detecção
        const backgroundColor = hexToRgb(backgroundColorInput.value);
        gridSize = detectGridSize(ctx, image.width, image.height, backgroundColor);
        
        if (gridSize < 2) {
            alert('Não foi possível detectar automaticamente o tamanho do grid. Por favor, defina a quantidade de quadrados por linha.');
            return;
        }
        
        // Calcular a quantidade de colunas baseado no tamanho detectado
        gridColumns = Math.ceil(image.width / gridSize);
    } else {
        // Calcular o tamanho dos quadrados com base na largura da imagem
        gridSize = Math.round(image.width / gridColumns);
    }
    
    if (gridSize < 1) {
        alert('Tamanho de grid inválido. Por favor, verifique o número de quadrados por linha.');
        return;
    }
    
    // Obter configurações
    const backgroundColor = hexToRgb(backgroundColorInput.value);
    const ignoreBackground = ignoreBackgroundCheck.checked;
    const groupColors = groupColorsCheck.checked;
    const showHexColors = showHexColorsCheck.checked;
    
    // Analisar a imagem
    const result = analyzeImage(ctx, image.width, image.height, gridSize, backgroundColor, ignoreBackground, groupColors);
    
    // Exibir os resultados
    displayResults(result, gridSize, gridColumns, backgroundColor, ignoreBackground, groupColors, showHexColors);
    
    // Após exibir os resultados, adicione este código:
    // Pequeno atraso para garantir que os resultados foram renderizados
    setTimeout(() => {
        // Rolagem suave até a seção de resultados
        document.getElementById('results').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }, 10);
});

// Função para converter hex para rgb
function hexToRgb(hex) {
    return chroma(hex).css('rgb');
}

// Função para obter a cor de um pixel (apenas RGB)
function getPixelColor(imageData, width, x, y) {
    const index = (y * width + x) * 4;
    return {
        r: imageData[index],
        g: imageData[index + 1],
        b: imageData[index + 2]
    };
}

// Função para comparar cores (apenas RGB)
function colorEquals(color1, color2) {
    return color1.r === color2.r && 
           color1.g === color2.g && 
           color1.b === color2.b;
}

// Função para converter cor para string (apenas RGB)
function colorToString(color) {
    return `rgb(${color.r},${color.g},${color.b})`;
}

// Função para detectar o tamanho do grid
function detectGridSize(ctx, width, height, backgroundColor) {
    const imageData = ctx.getImageData(0, 0, width, height).data;
    const maxGridSize = Math.min(width, height) / 2; // Limite máximo razoável
    
    // Método 1: Análise de transição de cores
    const transitionPoints = findColorTransitionPoints(imageData, width, height, backgroundColor);
    if (transitionPoints.length >= 2) {
        // Calcular distâncias entre pontos de transição
        const distances = [];
        for (let i = 1; i < transitionPoints.length; i++) {
            const distance = transitionPoints[i] - transitionPoints[i-1];
            if (distance > 1) {
                distances.push(distance);
            }
        }
        
        // Encontrar a distância mais comum (moda)
        if (distances.length > 0) {
            const distanceCounts = {};
            let maxCount = 0;
            let mostCommonDistance = 0;
            
            distances.forEach(distance => {
                distanceCounts[distance] = (distanceCounts[distance] || 0) + 1;
                if (distanceCounts[distance] > maxCount) {
                    maxCount = distanceCounts[distance];
                    mostCommonDistance = distance;
                }
            });
            
            if (mostCommonDistance > 1 && mostCommonDistance <= maxGridSize) {
                return mostCommonDistance;
            }
        }
    }
    
    // Método 2: Análise de frequência de cores por linha
    const possibleSizes = findPossibleGridSizes(imageData, width, height);
    if (possibleSizes.length > 0) {
        // Retornar o tamanho mais comum
        return possibleSizes[0];
    }
    
    // Método 3: Testar tamanhos diferentes e verificar uniformidade
    for (let size = 10; size <= maxGridSize; size++) {
        if (checkGridUniformity(imageData, width, height, size)) {
            return size;
        }
    }
    
    return 1; // Fallback: um pixel por célula
}

// Função para encontrar pontos de transição de cor
function findColorTransitionPoints(imageData, width, height, backgroundColor) {
    const transitionPoints = [];
    
    // Analisar linhas horizontais (procurar transições verticais)
    for (let y = 0; y < height; y++) {
        let lastColor = null;
        for (let x = 0; x < width; x++) {
            const color = getPixelColor(imageData, width, x, y);
            const colorStr = colorToString(color);
            
            if (lastColor && colorStr !== lastColor) {
                transitionPoints.push(x);
            }
            
            lastColor = colorStr;
        }
    }
    
    // Analisar colunas verticais (procurar transições horizontais)
    for (let x = 0; x < width; x++) {
        let lastColor = null;
        for (let y = 0; y < height; y++) {
            const color = getPixelColor(imageData, width, x, y);
            const colorStr = colorToString(color);
            
            if (lastColor && colorStr !== lastColor) {
                transitionPoints.push(y);
            }
            
            lastColor = colorStr;
        }
    }
    
    // Ordenar e remover duplicatas
    return [...new Set(transitionPoints)].sort((a, b) => a - b);
}

// Função para encontrar possíveis tamanhos de grade
function findPossibleGridSizes(imageData, width, height) {
    const sizeFrequency = {};
    const maxTestSize = Math.min(width, height) / 3;
    
    // Testar diferentes tamanhos de grade
    for (let size = 2; size <= maxTestSize; size++) {
        let isConsistent = true;
        
        // Verificar se todas as células da grade têm cores uniformes
        for (let y = 0; y < height - size; y += size) {
            for (let x = 0; x < width - size; x += size) {
                const centerColor = getPixelColor(imageData, width, x + Math.floor(size/2), y + Math.floor(size/2));
                
                // Verificar os cantos
                const corners = [
                    getPixelColor(imageData, width, x, y),
                    getPixelColor(imageData, width, x + size - 1, y),
                    getPixelColor(imageData, width, x, y + size - 1),
                    getPixelColor(imageData, width, x + size - 1, y + size - 1)
                ];
                
                // Se os cantos forem diferentes do centro, este tamanho pode não ser consistente
                for (const corner of corners) {
                    if (!colorEquals(centerColor, corner)) {
                        isConsistent = false;
                        break;
                    }
                }
                
                if (!isConsistent) break;
            }
            if (!isConsistent) break;
        }
        
        if (isConsistent) {
            sizeFrequency[size] = (sizeFrequency[size] || 0) + 1;
        }
    }
    
    // Ordenar por frequência
    return Object.keys(sizeFrequency)
        .map(size => parseInt(size))
        .sort((a, b) => sizeFrequency[b] - sizeFrequency[a]);
}

// Função para verificar a uniformidade da grade
function checkGridUniformity(imageData, width, height, gridSize) {
    const rows = Math.floor(height / gridSize);
    const cols = Math.floor(width / gridSize);
    
    let uniformCount = 0;
    let totalCount = 0;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * gridSize;
            const y = row * gridSize;
            
            const centerColor = getPixelColor(imageData, width, x + Math.floor(gridSize/2), y + Math.floor(gridSize/2));
            let isUniform = true;
            
            // Verificar se todos os pixels na célula são da mesma cor
            outerLoop:
            for (let dy = 0; dy < gridSize; dy++) {
                for (let dx = 0; dx < gridSize; dx++) {
                    const pixelColor = getPixelColor(imageData, width, x + dx, y + dy);
                    if (!colorEquals(centerColor, pixelColor)) {
                        isUniform = false;
                        break outerLoop;
                    }
                }
            }
            
            if (isUniform) uniformCount++;
            totalCount++;
        }
    }
    
    // Se mais de 90% das células são uniformes, considerar um bom tamanho de grade
    return uniformCount / totalCount > 0.9;
}

// Elementos de configuração de análise
const startLineSelect = document.getElementById('startLine');
const readingDirectionSelect = document.getElementById('readingDirection');
const alternatingStartSelect = document.getElementById('alternatingStart');
const alternatingOptions = document.getElementById('alternatingOptions');

// Mostrar/ocultar opções de alternância baseado na seleção de direção
readingDirectionSelect.addEventListener('change', function() {
    alternatingOptions.style.display = 
        this.value === 'alternating' ? 'block' : 'none';
});

// Função para obter as configurações de análise
function getAnalysisConfig() {
    // Direção da linha inicial
    const startFromLast = startLineSelect.value === 'last';
    
    // Direção de leitura
    const readingDirection = readingDirectionSelect.value;
    
    // Direção inicial para o modo alternado
    const alternatingStart = alternatingStartSelect.value;
    
    return {
        startFromLast,
        readingDirection,
        alternatingStart
    };
}

// Função modificada para analisar a imagem
function analyzeImage(ctx, width, height, gridSize, backgroundColor, ignoreBackground, groupColors) {
    const rows = Math.ceil(height / gridSize);
    const cols = Math.ceil(width / gridSize);
    const result = [];
    
    // Obter configurações de análise
    const { startFromLast, readingDirection, alternatingStart } = getAnalysisConfig();
    
    // Obter dados da imagem
    const imageData = ctx.getImageData(0, 0, width, height).data;
    
    // Mapa para agrupar cores semelhantes
    const colorGroups = {};
    
    // Pré-processamento: identificar e agrupar cores semelhantes
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * gridSize + Math.floor(gridSize / 2);
            const y = row * gridSize + Math.floor(gridSize / 2);
            
            if (x < width && y < height) {
                const color = getPixelColor(imageData, width, x, y);
                const colorStr = colorToString(color);
                
                // Ignorar a cor de fundo se solicitado
                if (ignoreBackground && chroma.deltaE(colorStr, backgroundColor) < 10) {
                    continue;
                }
                
                // Obter nome da cor
                const r = color.r, g = color.g, b = color.b;
                const colorName = getColorName(r, g, b);
                
                // Usar o nome da cor como chave para agrupamento
                if (!colorGroups[colorName]) {
                    colorGroups[colorName] = {
                        name: colorName,
                        representative: colorStr,  // Usar a primeira cor como representante do grupo
                        colors: [colorStr]
                    };
                } else if (!colorGroups[colorName].colors.includes(colorStr)) {
                    colorGroups[colorName].colors.push(colorStr);
                }
            }
        }
    }
    
    // Determinar a ordem de processamento das linhas
    let rowIndices = [];
    for (let i = 0; i < rows; i++) {
        rowIndices.push(i);
    }
    
    // Reverter índices se começar da última linha
    if (startFromLast) {
        rowIndices.reverse();
    }
    
    // Variável para rastrear quantas linhas não-vazias foram processadas
    // (para correta alternância de direção)
    let nonEmptyRowCount = 0;
    
    // Analisar cada linha na ordem determinada
    rowIndices.forEach((rowIndex, rowArrayIndex) => {
        let rowData;
        
        // Determinar a direção para esta linha específica
        let direction = readingDirection;
        if (readingDirection === 'alternating') {
            // Se estamos intercalando, determinar a direção baseado na contagem de linhas não-vazias
            direction = (alternatingStart === 'ltr') 
                ? (nonEmptyRowCount % 2 === 0 ? 'ltr' : 'rtl')
                : (nonEmptyRowCount % 2 === 0 ? 'rtl' : 'ltr');
        }
        
        // Verificar se a linha tem conteúdo
        let hasContent = false;
        
        if (groupColors) {
            // Processar com agrupamento por cor
            rowData = {
                index: rowIndex,
                arrayIndex: rowArrayIndex,
                colors: {},
                isGrouped: true,
                direction
            };
            
            // Determinar a ordem de processamento das colunas
            let colIndices = [];
            for (let i = 0; i < cols; i++) {
                colIndices.push(i);
            }
            
            if (direction === 'rtl') {
                colIndices.reverse();
            }
            
            // Processar cada célula
            colIndices.forEach(colIndex => {
                const x = colIndex * gridSize + Math.floor(gridSize / 2);
                const y = rowIndex * gridSize + Math.floor(gridSize / 2);
                
                if (x < width && y < height) {
                    const color = getPixelColor(imageData, width, x, y);
                    const colorStr = colorToString(color);
                    
                    // Ignorar a cor de fundo
                    if (ignoreBackground && chroma.deltaE(colorStr, backgroundColor) < 10) {
                        return;
                    }
                    
                    // Se chegamos aqui, a célula tem cor e não é fundo
                    hasContent = true;
                    
                    // Encontrar a qual grupo esta cor pertence
                    const r = color.r, g = color.g, b = color.b;
                    const colorName = getColorName(r, g, b);
                    const groupRepresentative = colorGroups[colorName]?.representative || colorStr;
                    
                    // Usar o representante do grupo para contar
                    if (rowData.colors[colorName]) {
                        rowData.colors[colorName].count++;
                    } else {
                        rowData.colors[colorName] = {
                            count: 1,
                            colorStr: groupRepresentative
                        };
                    }
                }
            });
        } else {
            // Processar preservando sequências
            rowData = {
                index: rowIndex,
                arrayIndex: rowArrayIndex,
                sequences: [],
                isGrouped: false,
                direction
            };
            
            let currentSequence = null;
            
            // Determinar a ordem de processamento das colunas
            let colIndices = [];
            for (let i = 0; i < cols; i++) {
                colIndices.push(i);
            }
            
            if (direction === 'rtl') {
                colIndices.reverse();
            }
            
            // Processar cada célula
            colIndices.forEach(colIndex => {
                const x = colIndex * gridSize + Math.floor(gridSize / 2);
                const y = rowIndex * gridSize + Math.floor(gridSize / 2);
                
                if (x < width && y < height) {
                    const color = getPixelColor(imageData, width, x, y);
                    const colorStr = colorToString(color);
                    
                    // Ignorar a cor de fundo
                    if (ignoreBackground && chroma.deltaE(colorStr, backgroundColor) < 10) {
                        if (currentSequence) {
                            rowData.sequences.push(currentSequence);
                            currentSequence = null;
                        }
                        return;
                    }
                    
                    // Se chegamos aqui, a célula tem cor e não é fundo
                    hasContent = true;
                    
                    // Encontrar a qual grupo esta cor pertence
                    const r = color.r, g = color.g, b = color.b;
                    const colorName = getColorName(r, g, b);
                    const groupRepresentative = colorGroups[colorName]?.representative || colorStr;
                    
                    // Se não temos uma sequência ou a cor é diferente, iniciar nova sequência
                    if (!currentSequence || currentSequence.colorName !== colorName) {
                        if (currentSequence) {
                            rowData.sequences.push(currentSequence);
                        }
                        
                        currentSequence = {
                            color: groupRepresentative,
                            colorName: colorName,
                            count: 1,
                            position: colIndex
                        };
                    } else {
                        currentSequence.count++;
                    }
                }
            });
            
            if (currentSequence) {
                rowData.sequences.push(currentSequence);
            }
            
            // Verificar se a linha tem sequências
            hasContent = rowData.sequences.length > 0;
        }
        
        // Só adicionar a linha se tiver conteúdo (cores além do fundo)
        if (hasContent) {
            rowData.hasContent = true;
            result.push(rowData);
            
            // Incrementar o contador de linhas não-vazias para alternância
            nonEmptyRowCount++;
        } else {
            // Adicionar marcador para linha vazia (para referência)
            result.push({
                index: rowIndex,
                arrayIndex: rowArrayIndex,
                hasContent: false,
                direction
            });
        }
    });
    
    return result;
}

// Função para exibir os resultados
function displayResults(result, gridSize, columnsCount, backgroundColor, ignoreBackground, groupColors, showHexColors) {
    // Limpar resultados anteriores
    resultsContent.innerHTML = '';
    
    // Criar tabela de resultados
    const table = document.createElement('table');
    
    // Cabeçalho da tabela
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const thLine = document.createElement('th');
    thLine.textContent = 'Linha';
    headerRow.appendChild(thLine);
    
    const thColors = document.createElement('th');
    thColors.textContent = 'Cores (quantidade)';
    headerRow.appendChild(thColors);
    
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Corpo da tabela
    const tbody = document.createElement('tbody');
    
    // Rastrear linhas vazias para exibir mensagem consolidada
    let emptyLines = [];
    let currentEmptyStreak = null;
    
    result.forEach(row => {
        // Pular linhas sem conteúdo
        if (!row.hasContent) {
            // Rastrear linhas vazias para mostrar consolidadas
            if (!currentEmptyStreak) {
                currentEmptyStreak = { start: row.index + 1, end: row.index + 1 };
            } else {
                currentEmptyStreak.end = row.index + 1;
            }
            return;
        } else {
            // Finalizar streak de linhas vazias se existir
            if (currentEmptyStreak) {
                emptyLines.push(currentEmptyStreak);
                currentEmptyStreak = null;
            }
        }
        
        const tr = document.createElement('tr');
        
        const tdLine = document.createElement('td');
        // Mostrar número real da linha na imagem (linha+1 para exibição ao usuário)
        tdLine.textContent = row.index + 1;
        tdLine.style.textAlign = 'center';
        tdLine.style.fontSize = '1.25rem';
        tdLine.style.fontWeight = '500';
        tdLine.style.verticalAlign = 'middle';
        
        // Adicionar informação sobre a direção
        const directionIcon = row.direction === 'ltr' ? '<i class="fas fa-arrow-right"></i>' : '<i class="fas fa-arrow-left"></i>';
        tdLine.appendChild(document.createElement('br'));
        const dirSpan = document.createElement('span');
        dirSpan.innerHTML = directionIcon;
        dirSpan.classList.add('text-primary');
        dirSpan.style.color = '#666';
        tdLine.appendChild(dirSpan);
        
        tr.appendChild(tdLine);
        
        const tdColors = document.createElement('td');
        
        if (row.isGrouped) {
            // Exibir cores agrupadas
            const hasColors = Object.keys(row.colors).length > 0;
            
            if (hasColors) {
                // Ordenar cores por quantidade (decrescente)
                const sortedColors = Object.entries(row.colors)
                    .sort((a, b) => b[1].count - a[1].count);
                
                for (const [colorName, data] of sortedColors) {
                    const colorDiv = document.createElement('div');
                    colorDiv.style.marginBottom = '5px';
                    
                    // Extrair valores RGB da string
                    const colorStr = data.colorStr;
                    const rgbMatch = colorStr.match(/rgb\((\d+),(\d+),(\d+)\)/);
                    if (rgbMatch) {
                        const r = parseInt(rgbMatch[1]);
                        const g = parseInt(rgbMatch[2]);
                        const b = parseInt(rgbMatch[3]);
                        
                        // Obter valor hex para exibição
                        const hexColor = chroma(r, g, b).hex();
                        
                        const colorSample = document.createElement('span');
                        colorSample.className = 'color-sample';
                        colorSample.style.backgroundColor = colorStr;
                        
                        colorDiv.appendChild(colorSample);
                        
                        // Usar plural correto baseado na contagem
                        const count = data.count;
                        const quadradoText = count === 1 ? "quadrado" : "quadrados";
                        
                        // Mostrar ou não o valor hex dependendo da configuração
                        if (showHexColors) {
                            colorDiv.appendChild(document.createTextNode(
                                ` ${colorName} (${hexColor}): ${count} ${quadradoText}`
                            ));
                        } else {
                            colorDiv.appendChild(document.createTextNode(
                                ` ${colorName}: ${count} ${quadradoText}`
                            ));
                        }
                        
                        tdColors.appendChild(colorDiv);
                    }
                }
            } else {
                // Mostrar placeholder quando não há cores
                tdColors.textContent = "Não foram encontrados quadrados coloridos para essa linha.";
                tdColors.style.fontStyle = "italic";
                tdColors.style.color = "#666";
            }
        } else {
            // Exibir sequências de cores
            const hasSequences = row.sequences && row.sequences.length > 0;
            
            if (hasSequences) {
                for (const sequence of row.sequences) {
                    const colorDiv = document.createElement('div');
                    colorDiv.style.marginBottom = '5px';
                    
                    // Extrair valores RGB da string
                    const colorStr = sequence.color;
                    const rgbMatch = colorStr.match(/rgb\((\d+),(\d+),(\d+)\)/);
                    if (rgbMatch) {
                        const r = parseInt(rgbMatch[1]);
                        const g = parseInt(rgbMatch[2]);
                        const b = parseInt(rgbMatch[3]);
                        
                        // Obter valor hex para exibição
                        const hexColor = chroma(r, g, b).hex();
                        const colorName = sequence.colorName;
                        
                        const colorSample = document.createElement('span');
                        colorSample.className = 'color-sample';
                        colorSample.style.backgroundColor = colorStr;
                        
                        colorDiv.appendChild(colorSample);
                        
                        // Usar plural correto baseado na contagem
                        const quadradoText = sequence.count === 1 ? "quadrado" : "quadrados";
                        
                        // Mostrar ou não o valor hex dependendo da configuração
                        if (showHexColors) {
                            colorDiv.appendChild(document.createTextNode(
                                ` ${colorName} (${hexColor}): ${sequence.count} ${quadradoText}`
                            ));
                        } else {
                            colorDiv.appendChild(document.createTextNode(
                                ` ${colorName}: ${sequence.count} ${quadradoText}`
                            ));
                        }
                        
                        tdColors.appendChild(colorDiv);
                    }
                }
            } else {
                // Mostrar placeholder quando não há cores
                tdColors.textContent = "Não foram encontrados quadrados coloridos para essa linha.";
                tdColors.style.fontStyle = "italic";
                tdColors.style.color = "#666";
            }
        }
        
        tr.appendChild(tdColors);
        tbody.appendChild(tr);
    });
    
    // Finalizar última streak de linhas vazias
    if (currentEmptyStreak) {
        emptyLines.push(currentEmptyStreak);
    }
    
    // Adicionar uma linha com informação sobre as linhas vazias
    if (emptyLines.length > 0) {
        const tr = document.createElement('tr');
        
        const tdInfo = document.createElement('td');
        tdInfo.colSpan = 2;
        tdInfo.style.textAlign = 'center';
        tdInfo.style.fontStyle = 'italic';
        tdInfo.style.color = '#666';
        
        // Formatar texto com as linhas vazias
        let emptyLinesText = 'Linhas vazias: ';
        emptyLinesText += emptyLines.map(streak => {
            if (streak.start === streak.end) {
                return `${streak.start}`;
            } else {
                return `${streak.start}-${streak.end}`;
            }
        }).join(', ');
        
        tdInfo.textContent = emptyLinesText;
        tr.appendChild(tdInfo);
        tbody.appendChild(tr);
    }
    
    table.appendChild(tbody);
    resultsContent.appendChild(table);
    
    // Adicionar informações sobre a grade
    const gridInfo = document.createElement('p');
    gridInfo.innerHTML = `Análise baseada em ${columnsCount} quadrados por linha (${gridSize}×${gridSize} pixels por quadrado)`;
    
    if (ignoreBackground) {
        // Analisar a cor de fundo
        try {
            const bgColorObj = chroma(backgroundColor);
            const bgHex = bgColorObj.hex();
            const rgbMatch = backgroundColor.match(/rgb\((\d+),(\d+),(\d+)\)/);
            if (rgbMatch) {
                const r = parseInt(rgbMatch[1]);
                const g = parseInt(rgbMatch[2]);
                const b = parseInt(rgbMatch[3]);
                const bgColorName = getColorName(r, g, b);
                
                if (showHexColors) {
                    gridInfo.innerHTML += `<br>Cor de fundo ${bgColorName} (${bgHex}) foi ignorada nos resultados.`;
                } else {
                    gridInfo.innerHTML += `<br>Cor de fundo ${bgColorName} foi ignorada nos resultados.`;
                }
            }
        } catch (e) {
            gridInfo.innerHTML += `<br>Cor de fundo foi ignorada nos resultados.`;
        }
    }
    
    // Informar sobre o modo de agrupamento
    if (groupColors) {
        gridInfo.innerHTML += `<br>Os quadrados da mesma cor foram agrupados.`;
    } else {
        gridInfo.innerHTML += `<br>As sequências de cores foram mantidas na ordem em que aparecem.`;
    }
    
    // Adicionar informações sobre configurações de análise
    const { startFromLast, readingDirection, alternatingStart } = getAnalysisConfig();
    
    let directionInfo = '';
    if (readingDirection === 'ltr') {
        directionInfo = 'Esquerda para direita';
    } else if (readingDirection === 'rtl') {
        directionInfo = 'Direita para esquerda';
    } else {
        const firstDir = alternatingStart === 'ltr' ? 'esquerda para direita' : 'direita para esquerda';
        directionInfo = `Intercalado (primeira linha: ${firstDir})`;
    }
    
    gridInfo.innerHTML += `<br>Análise iniciada pela ${startFromLast ? 'última' : 'primeira'} linha, direção: ${directionInfo}.`;
    
    resultsContent.insertBefore(gridInfo, table);
}