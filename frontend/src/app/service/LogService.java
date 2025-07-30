package br.jus.treba.aplicacao.service;

import br.jus.treba.aplicacao.model.Log;
import br.jus.treba.aplicacao.repository.LogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LogService {

    @Autowired
    private LogRepository logRepository;

    public Log salvarLog(Log log) {
        return logRepository.save(log);
    }
}
