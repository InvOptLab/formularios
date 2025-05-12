"use client";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const Introducao = () => {
  return (
    <Box sx={{ p: 2 }} width="60%">
      <Typography variant="h5" gutterBottom>
        Bem-vindo à Plataforma de Preenchimento de Formulários
      </Typography>
      <List>
        <ListItem alignItems="flex-start">
          <ListItemText
            primary="1️⃣ Seleção de Turmas"
            secondary={
              <>
                O processo inicia com a seleção das turmas de interesse. Essa
                seleção é apresentada como itens de uma loja, onde você poderá
                escolher as turmas e adicioná-las a um “carrinho”. Caso deseje,
                já é possível definir a prioridade para cada turma no momento da
                adição. Mas fique tranquilo: o próximo passo permitirá revisar e
                modificar essas prioridades.
                <br />
                <strong>Importante:</strong> Para prosseguir, ao menos uma turma
                deve ser selecionada. Todas as telas apresentam botões de{" "}
                <em>Voltar</em> e <em>Continuar</em> para revisão do processo.
              </>
            }
          />
        </ListItem>

        <Divider component="li" sx={{ my: 2 }} />

        <ListItem alignItems="flex-start">
          <ListItemText
            primary="2️⃣ Confirmação de Seleção"
            secondary={
              <>
                Neste passo, você poderá confirmar as turmas selecionadas,
                visualizando-as em uma tabela com informações principais, como
                nome e horários. Uma coluna específica exibirá as prioridades,
                que podem ser editadas ou preenchidas (caso não tenham sido
                informadas anteriormente).
                <br />
                <strong>Importante:</strong> Todas as prioridades devem ser
                preenchidas com valores maiores que zero. Além disso, não é
                permitido atribuir o mesmo valor de prioridade para mais de uma
                turma.
              </>
            }
          />
        </ListItem>

        <Divider component="li" sx={{ my: 2 }} />

        <ListItem alignItems="flex-start">
          <ListItemText
            primary="3️⃣ Avaliação da Atribuição Anterior"
            secondary={
              <>
                Antes de finalizar, você poderá preencher um pequeno formulário
                com apenas três campos. Ele tem como objetivo nos ajudar a
                entender onde e como podemos melhorar. As respostas serão
                utilizadas como feedback para que seja possível refinar
                continuamente o processo de atribuição.
                <br />
                <strong>Importante:</strong> A única exigência obrigatória é a
                atribuição de uma nota.
              </>
            }
          />
        </ListItem>

        <Divider component="li" sx={{ my: 2 }} />

        <ListItem alignItems="flex-start">
          <ListItemText
            primary="4️⃣ Download do Arquivo"
            secondary={
              <>
                No último passo, você poderá baixar o arquivo finalizado, que
                deverá ser enviado à comissão responsável pelo processo de
                atribuição. Detalhes adicionais e instruções estarão disponíveis
                nesta etapa para garantir que tudo ocorra corretamente.
                <br />
                <strong>Importante:</strong> Para concluir o processo, é
                necessário preencher o campo com seu nome completo e exportar o
                arquivo final.
              </>
            }
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default Introducao;
