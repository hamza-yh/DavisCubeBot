type PersonalInfo = {
    name: string;
    gender: 'm' | 'f' | 'o';
    url: string;
    country: {
        id: string;
        name: string;
        continentId: string;
        iso2: string;
    };
    delegate_status: string | null;
    avatar: {
        url: string;
        thumb_url: string;
        is_default: boolean;
    };
    wca_id: string;
    country_iso2: string;
    id: string;
};

type PersonalRecord = {
    single: {
        best: number;
        world_rank: number;
        continent_rank: number;
        country_rank: number;
    };
    average?: {
        best: number;
        world_rank: number;
        continent_rank: number;
        country_rank: number;
    };
};

type Person = {
    person: PersonalInfo;
    competition_count: number;
    personal_records: {
        '222'?: PersonalRecord;
        '333bf'?: PersonalRecord;
        '333'?: PersonalRecord;
        '333fm'?: PersonalRecord;
        '333mbf'?: PersonalRecord;
        '333mbo'?: PersonalRecord;
        '333oh'?: PersonalRecord;
        '333ft'?: PersonalRecord;
        '444bf'?: PersonalRecord;
        '444'?: PersonalRecord;
        '555bf'?: PersonalRecord;
        '555'?: PersonalRecord;
        '666'?: PersonalRecord;
        '777'?: PersonalRecord;
        clock?: PersonalRecord;
        magic?: PersonalRecord;
        mmagic?: PersonalRecord;
        minx?: PersonalRecord;
        pyram?: PersonalRecord;
        skewb?: PersonalRecord;
        sq1?: PersonalRecord;
    };
    medals: {
        gold: number;
        silver: number;
        bronze: number;
        total: number;
    };
    records: {
        national: number;
        continental: number;
        world: number;
        total: number;
    };
};

type Competition = {
    id: string;
    name: string;
    short_display_name: string;
    registration_open: string;
    registration_close: string;
    announced_at: string;
    start_date: string;
    end_date: string;
    event_ids: string[];
    latitude_degrees: number;
    longitude_degrees: number;
};

export { Person, Competition, PersonalInfo };
