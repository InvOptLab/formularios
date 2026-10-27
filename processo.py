import os
import json
import pandas as pd

INPUT_DIR = r'../carga_didatica/2026-1/formularios/'

resultado = {"versao": "3.0", "formularios": {}, "disciplinas": {}, "docentes": [], "saldos": {}}

disciplinas: list[dict] = json.load(open('public/turmas.json', 'r',  encoding='utf-8'))

for d in disciplinas:
    d['cursos'] = d['curso']
    d['docentes'] = [] # Aproveitando que já está sendo iterado
    del d['curso']

## Ajustar as turmas adicionando o campo "docentes"

dictPlinas = {disciplinas[i]['id'] : disciplinas[i] for i in range(0,len(disciplinas))}

docentesAvaliacao = {}

# Percorre todos os arquivos .json da pasta
for arquivo in os.listdir(INPUT_DIR):
    if arquivo.endswith('.json'):
        caminho = os.path.join(INPUT_DIR, arquivo)
        with open(caminho, 'r', encoding='utf-8') as f:
            dados = json.load(f)
            nome_arquivo = os.path.splitext(os.path.basename(caminho))[0] 
            
            docentesAvaliacao[nome_arquivo] = dados[list(dados.keys())[0]]['avaliacao']

            for nome, info in dados.items():
                formulariosDocente = {}

                for key, value in info.get("formularios", {}).items():
                    
                    key_normalizada = key # Assume a chave original como padrão
                    try:
                        # 1. Tenta separar a disciplina e a turma
                        disciplina, turma_str = key.split(',')
                        
                        # 2. Normaliza a turma:
                        # '1.0' -> float(1.0) -> int(1) -> str('1')
                        # '1'   -> float(1.0) -> int(1) -> str('1')
                        turma_normalizada_str = str(int(float(turma_str)))
                        
                        # 3. Remonta a chave normalizada
                        key_normalizada = f"{disciplina},{turma_normalizada_str}"
                        
                    except ValueError:
                        pass # Deixa a key_normalizada como a original se falhar
                    
                    # Checa a CHAVE NORMALIZADA contra o DICT
                    if(key_normalizada in dictPlinas):
                        # Salva a CHAVE NORMALIZADA no resultado
                        formulariosDocente[key_normalizada] = value
                        
                    else:
                        if(key_normalizada+'1' in dictPlinas):
                            # Agora salvamos a CHAVE NORMALIZADA no resultado
                            formulariosDocente[key_normalizada+'1'] = value
                        else:
                            print(f"Docente: {nome}, Chave não encontrada: {key} (Normalizada: {key_normalizada})")
                
                resultado["formularios"][nome_arquivo] = formulariosDocente

for docente, turmasDocente in resultado.get("formularios", {}).items():
    if not turmasDocente:
        continue

    for turma in turmasDocente.keys():
        tDict = dictPlinas.get(turma)
        if tDict is not None:
            tDict.setdefault('docentes', []).append(docente)

resultado["disciplinas"] = disciplinas

# Docentes e Saldos
df = pd.read_excel(INPUT_DIR + "/_ICMC _listagem docentes-somente docentes SME.xlsx").dropna( subset = [ 'Carga' ] )

df.drop( columns = [ 'Saldo Anterior', 'Gestão', 'Bônus Gestão', 'Carga', 'Carga Gestão', 'Status', 'Carga Ponderada', 'Carga Gestão Ponderada' ])

for nome, saldo in zip(df['Docente'], df['Novo Saldo']):
    
    #    Se o 'nome' não estiver no dicionário, retorna um dicionário vazio {}
    avaliacao_docente = docentesAvaliacao.get(nome, {})

    #    Se a chave ('comentario' ou 'preferencia') não existir, retorna ""
    comentario = avaliacao_docente.get('comentario', "")
    preferencia = avaliacao_docente.get('preferencia', "")
    
    # Adiciona os dados à lista "docentes"
    resultado["docentes"].append({
        'nome': nome, 
        "ativo": True, 
        "comentario": comentario, 
        "agrupar": preferencia
    })
    
    # Atualiza o dicionário "saldos". 
    resultado["saldos"][nome] = saldo

# Preenche a tag `formulario` com `{}` caso o docente não tenha aprentado formulários.

for nome in df['Docente']:
    if not resultado['formularios'].get(nome):
        resultado['formularios'][nome] = {}

# Se quiser salvar esse resultado em um novo arquivo:
with open('formularios_combinados.json', 'w', encoding='utf-8') as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)