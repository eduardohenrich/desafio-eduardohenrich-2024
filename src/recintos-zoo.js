class RecintosZoo {

    constructor() {
        this.recintos = [
            { numero: 1, bioma: ['savana'] , tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3, carnivoro: false }] },
            { numero: 2, bioma: ['floresta'], tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: ['savana', 'rio'], tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1, carnivoro: false }] },
            { numero: 4, bioma: ['rio'], tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: ['savana'], tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1, carnivoro: true }] }
        ];

        this.animaisDisponiveis = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        if (!(animal in this.animaisDisponiveis)) {
            return {erro: "Animal inválido", recintosViaveis: null} ;
        }

        const AnimalInformado = this.animaisDisponiveis[animal];
        const espacoNecessario = quantidade * AnimalInformado.tamanho;

        // Filtra os recintos que o animal pode habitar
        const recintosViaveis = this.recintos.filter(recinto => {
            // Verifica se algum dos biomas do recinto é compatível com o animal
            const biomaCompativel = recinto.bioma.some(bioma => AnimalInformado.biomas.includes(bioma));
            if (!biomaCompativel) {
                return false;
            }

            // Calcula o espaço já ocupado no recinto
            let espacoOcupado = recinto.animais.reduce((total, a) => {
                const espacoAnimal = this.animaisDisponiveis[a.especie].tamanho * a.quantidade;
                return total + espacoAnimal;
            }, 0);

            // Verifica se há espaço suficiente
            const espacoLivre = recinto.tamanhoTotal - espacoOcupado;
            if (espacoLivre < espacoNecessario) {
                return false;
            }

            // calcula se existe mais de uma especie no mesmo recinto
            const especiesNoRecinto = recinto.animais.map(a => a.especie);
            // verefica se possui ao menos um carnivoro no recinto
            const temCarnivoro = recinto.animais.some(a => this.animaisDisponiveis[a.especie].carnivoro);

            // verifica se possui um outro carnivoro de outra especie 
            if (AnimalInformado.carnivoro && especiesNoRecinto.length > 0) {
                return false;
            }

            //animal nao carnivoro nao pode conviver com carnivoro
            if (temCarnivoro && !AnimalInformado.carnivoro) {
                return false;
            }

            // hipopotamo não convive com outro no mesmo bioma exceto savna e rio
            if (animal === 'HIPOPOTAMO' && !recinto.bioma.includes('savana','rio') && especiesNoRecinto.length > 0) {
                return false;
            }

            return true;
        });

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }
        
        const recintosViaveisFormatados = recintosViaveis.map(recinto => {
            let espacoOcupado = recinto.animais.reduce((total, a) => {
                const espacoAnimal = this.animaisDisponiveis[a.especie].tamanho * a.quantidade;
                return total + espacoAnimal;
            }, 0);

            let espacoLivre = recinto.tamanhoTotal - espacoOcupado - espacoNecessario;

            // cria um novo array contendo todas as especies que estao no recinto
            const especiesNoRecinto = recinto.animais.map(a => a.especie);

            // verifica se a especie do animal esta inclusa no recinto
            if (especiesNoRecinto.length > 0 && !especiesNoRecinto.includes(animal)) {
                return "Recinto "+recinto.numero+" (espaço livre: " + (espacoLivre-1) + " total: " +recinto.tamanhoTotal+ ")";
            }

            return "Recinto " +recinto.numero+" (espaço livre: " + espacoLivre+ " total: " +recinto.tamanhoTotal+")";
        });

        return { erro: null, recintosViaveis: recintosViaveisFormatados };
    }

}


export { RecintosZoo as RecintosZoo };

